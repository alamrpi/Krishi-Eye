using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductById;
using KrishiEye.Services.Catalog.Application.Products.Specifications;
using KrishiEye.Services.Catalog.Domain.Repositories;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Queries.SearchProducts;

public record SearchProductsQuery(
    string? SearchTerm,
    Guid? CategoryId,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? InStockOnly,
    int Skip = 0,
    int Take = 20) : IRequest<SearchProductsResult>;

public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, SearchProductsResult>
{
    private readonly IProductRepository _productRepository;

    public SearchProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<SearchProductsResult> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        // Build specification based on filters
        var products = new List<Domain.Entities.Product>();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var spec = new ProductSearchSpecification(request.SearchTerm);
            products = await _productRepository.GetListBySpecAsync(spec, cancellationToken);
        }
        else if (request.CategoryId.HasValue)
        {
            var spec = new ProductsByCategorySpecification(request.CategoryId.Value);
            products = await _productRepository.GetListBySpecAsync(spec, cancellationToken);
        }
        else if (request.MinPrice.HasValue && request.MaxPrice.HasValue)
        {
            var spec = new ProductsByPriceRangeSpecification(request.MinPrice.Value, request.MaxPrice.Value);
            products = await _productRepository.GetListBySpecAsync(spec, cancellationToken);
        }
        else
        {
            products = await _productRepository.GetAllAsync(cancellationToken);
        }

        // Apply in-stock filter
        if (request.InStockOnly == true)
        {
            products = products.Where(p => p.IsInStock()).ToList();
        }

        // Manual pagination (could be improved with Specification paging)
        var total = products.Count;
        var pagedProducts = products
            .Skip(request.Skip)
            .Take(request.Take)
            .ToList();

        var productDtos = pagedProducts.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price.Amount,
            Currency = p.Price.Currency,
            StockQuantity = p.StockQuantity,
            ImageUrl = p.ImageUrl,
            IsInStock = p.IsInStock(),
            ProductTypeName = p.ProductType?.Name ?? string.Empty,
            CategoryName = p.Category?.Name ?? string.Empty,
            UnitName = p.Unit?.Name ?? string.Empty,
            UnitSymbol = p.Unit?.Symbol ?? string.Empty,
            UrlSlug = p.SeoMetadata.UrlSlug,
            MetaTitle = p.SeoMetadata.MetaTitle,
            MetaDescription = p.SeoMetadata.MetaDescription,
            CreatedAt = p.CreatedAt
        }).ToList();

        return new SearchProductsResult
        {
            Products = productDtos,
            TotalCount = total,
            Skip = request.Skip,
            Take = request.Take
        };
    }
}

public class SearchProductsResult
{
    public List<ProductDto> Products { get; set; } = new();
    public int TotalCount { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }
}
