using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.Repositories;
using KrishiEye.Services.Catalog.Domain.Specifications;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace KrishiEye.Services.Catalog.Infrastructure.Caching.Decorators;

/// <summary>
/// Cached decorator for ProductRepository implementing cache-aside pattern.
/// </summary>
public class CachedProductRepository : IProductRepository
{
    private readonly IProductRepository _inner;
    private readonly ICacheService _cache;
    private readonly CacheSettings _settings;
    private readonly ILogger<CachedProductRepository> _logger;

    public CachedProductRepository(
        IProductRepository inner,
        ICacheService cache,
        IOptions<CacheSettings> settings,
        ILogger<CachedProductRepository> logger)
    {
        _inner = inner;
        _cache = cache;
        _settings = settings.Value;
        _logger = logger;
    }

    #region IRepository Methods

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var cacheKey = CacheKeys.Products.ById(id);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _inner.GetByIdAsync(id, cancellationToken),
            _settings.ProductCacheDuration,
            cancellationToken);
    }

    public async Task<List<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Don't cache GetAll - can be huge dataset
        return await _inner.GetAllAsync(cancellationToken);
    }

    public async Task<Product?> GetBySpecAsync(ISpecification<Product> spec, CancellationToken cancellationToken = default)
    {
        // Specification queries are dynamic - skip caching
        return await _inner.GetBySpecAsync(spec, cancellationToken);
    }

    public async Task<List<Product>> GetListBySpecAsync(ISpecification<Product> spec, CancellationToken cancellationToken = default)
    {
        // Specification queries are dynamic - skip caching
        return await _inner.GetListBySpecAsync(spec, cancellationToken);
    }

    public async Task<int> CountAsync(ISpecification<Product> spec, CancellationToken cancellationToken = default)
    {
        return await _inner.CountAsync(spec, cancellationToken);
    }

    public async Task<Product> AddAsync(Product entity, CancellationToken cancellationToken = default)
    {
        var result = await _inner.AddAsync(entity, cancellationToken);
        
        // Invalidate list caches
        await InvalidateProductListCaches(result.CategoryId, result.ProductTypeId);
        
        return result;
    }

    public void Update(Product entity)
    {
        _inner.Update(entity);
        
        // Invalidate specific product caches
        _cache.RemoveAsync(CacheKeys.Products.ById(entity.Id)).Wait();
        _cache.RemoveAsync(CacheKeys.Products.BySlug(entity.SeoMetadata.UrlSlug)).Wait();
        
        // Invalidate list caches
        InvalidateProductListCaches(entity.CategoryId, entity.ProductTypeId).Wait();
        
        _logger.LogInformation("Invalidated cache for product: {ProductId}", entity.Id);
    }

    public void Delete(Product entity)
    {
        var categoryId = entity.CategoryId;
        var productTypeId = entity.ProductTypeId;
        
        _inner.Delete(entity);
        
        // Invalidate specific product caches
        _cache.RemoveAsync(CacheKeys.Products.ById(entity.Id)).Wait();
        _cache.RemoveAsync(CacheKeys.Products.BySlug(entity.SeoMetadata.UrlSlug)).Wait();
        
        // Invalidate list caches
        InvalidateProductListCaches(categoryId, productTypeId).Wait();
        
        _logger.LogInformation("Invalidated cache for deleted product: {ProductId}", entity.Id);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _inner.SaveChangesAsync(cancellationToken);
    }

    #endregion

    #region IProductRepository Methods

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var cacheKey = CacheKeys.Products.BySlug(slug);
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            () => _inner.GetBySlugAsync(slug, cancellationToken),
            _settings.ProductCacheDuration,
            cancellationToken);
    }

    public async Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        var cacheKey = CacheKeys.Products.ByCategory(categoryId);
        
        var result = await _cache.GetOrSetAsync<List<Product>>(
            cacheKey,
            async () =>
            {
                var products = await _inner.GetByCategoryIdAsync(categoryId, cancellationToken);
                return products;
            },
            _settings.ProductCacheDuration,
            cancellationToken);
        
        return result ?? new List<Product>();
    }

    public async Task<List<Product>> GetByProductTypeIdAsync(Guid productTypeId, CancellationToken cancellationToken = default)
    {
        var cacheKey = CacheKeys.Products.ByProductType(productTypeId);
        
        var result = await _cache.GetOrSetAsync<List<Product>>(
            cacheKey,
            async () =>
            {
                var products = await _inner.GetByProductTypeIdAsync(productTypeId, cancellationToken);
                return products;
            },
            _settings.ProductCacheDuration,
            cancellationToken);
        
        return result ?? new List<Product>();
    }

    public async Task<List<Product>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        var cacheKey = CacheKeys.Products.SearchResults(searchTerm);
        
        var result = await _cache.GetOrSetAsync<List<Product>>(
            cacheKey,
            async () =>
            {
                var products = await _inner.SearchAsync(searchTerm, cancellationToken);
                return products;
            },
            _settings.SearchResultCacheDuration,
            cancellationToken);
        
        return result ?? new List<Product>();
    }

    #endregion

    #region Helper Methods

    private async Task InvalidateProductListCaches(Guid categoryId, Guid productTypeId)
    {
        // Invalidate category and product type lists
        await _cache.RemoveAsync(CacheKeys.Products.ByCategory(categoryId));
        await _cache.RemoveAsync(CacheKeys.Products.ByProductType(productTypeId));
        
        // Invalidate all search result caches
        // This is aggressive but ensures consistency
        await _cache.RemoveByPrefixAsync(CacheKeys.Products.AllPrefix);
    }

    #endregion
}
