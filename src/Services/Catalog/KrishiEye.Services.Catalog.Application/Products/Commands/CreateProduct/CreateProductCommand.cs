using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal PriceAmount,
    string Currency,
    int StockQuantity,
    Guid UnitId,
    string ImageUrl,
    Guid SellerId,
    Guid ProductTypeId,
    Guid CategoryId,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription,
    string? MetaKeywords = null,
    string? OgTitle = null,
    string? OgDescription = null,
    string? OgImage = null) : IRequest<Guid>;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly ICatalogDbContext _context;

    public CreateProductCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Create value objects
        var price = Money.Create(request.PriceAmount, request.Currency);
        var seoMetadata = SeoMetadata.Create(
            request.UrlSlug,
            request.MetaTitle,
            request.MetaDescription,
            request.MetaKeywords,
            request.OgTitle,
            request.OgDescription,
            request.OgImage);

        // Create entity using factory method
        var product = Product.Create(
            request.Name,
            request.Description,
            price,
            request.StockQuantity,
            request.UnitId,
            request.ImageUrl,
            request.SellerId,
            request.ProductTypeId,
            request.CategoryId,
            seoMetadata);

        _context.Products.Add(product);

        await _context.SaveChangesAsync(cancellationToken);

        return product.Id;
    }
}
