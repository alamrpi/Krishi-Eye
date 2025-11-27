using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.ProductTypes.Commands.CreateProductType;

public record CreateProductTypeCommand(
    string Name,
    string Description,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription) : IRequest<Guid>;

public class CreateProductTypeCommandHandler : IRequestHandler<CreateProductTypeCommand, Guid>
{
    private readonly ICatalogDbContext _context;

    public CreateProductTypeCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateProductTypeCommand request, CancellationToken cancellationToken)
    {
        var seoMetadata = SeoMetadata.Create(
            request.UrlSlug,
            request.MetaTitle,
            request.MetaDescription);

        var productType = ProductType.Create(
            request.Name,
            request.Description,
            seoMetadata);

        _context.ProductTypes.Add(productType);
        await _context.SaveChangesAsync(cancellationToken);

        return productType.Id;
    }
}
