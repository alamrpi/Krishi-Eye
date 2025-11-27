using KrishiEye.Services.Catalog.Domain.Repositories;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _productRepository;

    public GetProductByIdQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);

        if (product == null)
            return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price.Amount,
            Currency = product.Price.Currency,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            IsInStock = product.IsInStock(),
            ProductTypeName = product.ProductType?.Name ?? string.Empty,
            CategoryName = product.Category?.Name ?? string.Empty,
            UnitName = product.Unit?.Name ?? string.Empty,
            UnitSymbol = product.Unit?.Symbol ?? string.Empty,
            UrlSlug = product.SeoMetadata.UrlSlug,
            MetaTitle = product.SeoMetadata.MetaTitle,
            MetaDescription = product.SeoMetadata.MetaDescription,
            CreatedAt = product.CreatedAt
        };
    }
}

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsInStock { get; set; }
    public string ProductTypeName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public string UnitSymbol { get; set; } = string.Empty;
    public string UrlSlug { get; set; } = string.Empty;
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
