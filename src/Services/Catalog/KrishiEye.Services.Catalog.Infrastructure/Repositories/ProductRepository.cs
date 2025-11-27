using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Infrastructure.Repositories;

/// <summary>
/// Product repository with specific query implementations.
/// </summary>
public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ICatalogDbContext context) : base(context)
    {
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Products
            .Include(p => p.ProductType)
            .Include(p => p.Category)
            .Include(p => p.Unit)
            .FirstOrDefaultAsync(p => p.SeoMetadata.UrlSlug == slug, cancellationToken);
    }

    public async Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Products
            .Include(p => p.ProductType)
            .Include(p => p.Category)
            .Include(p => p.Unit)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> GetByProductTypeIdAsync(Guid productTypeId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Products
            .Include(p => p.ProductType)
            .Include(p => p.Category)
            .Include(p => p.Unit)
            .Where(p => p.ProductTypeId == productTypeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Products
            .Include(p => p.ProductType)
            .Include(p => p.Category)
            .Include(p => p.Unit)
            .Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
            .ToListAsync(cancellationToken);
    }
}
