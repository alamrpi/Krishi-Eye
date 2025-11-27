using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductById;
using KrishiEye.Services.Catalog.Application.Products.Specifications;
using KrishiEye.Services.Catalog.Domain.Repositories;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Queries.GetProductsBySeller;

public record GetProductsBySellerQuery(Guid SellerId) : IRequest<List<ProductDto>>;

public class GetProductsBySellerQueryHandler : IRequestHandler<GetProductsBySellerQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsBySellerQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsBySellerQuery request, CancellationToken cancellationToken)
    {
        var spec = new ProductsBySellerSpecification(request.SellerId);
        var products = await _productRepository.GetListBySpecAsync(spec, cancellationToken);

        return products.Select(p => new ProductDto
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
    }
}
