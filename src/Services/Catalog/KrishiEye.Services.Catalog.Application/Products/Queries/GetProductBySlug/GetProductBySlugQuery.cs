using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductById;
using KrishiEye.Services.Catalog.Application.Products.Specifications;
using KrishiEye.Services.Catalog.Domain.Repositories;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Queries.GetProductBySlug;

public record GetProductBySlugQuery(string Slug) : IRequest<ProductDto?>;

public class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDto?>
{
    private readonly IProductRepository _productRepository;

    public GetProductBySlugQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        var spec = new ProductBySlugSpecification(request.Slug);
        var product = await _productRepository.GetBySpecAsync(spec, cancellationToken);

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
