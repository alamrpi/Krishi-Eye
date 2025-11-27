using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Application.ProductTypes.Queries.GetAllProductTypes;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.ProductTypes.Queries.GetProductTypeById;

public record GetProductTypeByIdQuery(Guid Id) : IRequest<ProductTypeDto?>;

public class GetProductTypeByIdQueryHandler : IRequestHandler<GetProductTypeByIdQuery, ProductTypeDto?>
{
    private readonly ICatalogDbContext _context;

    public GetProductTypeByIdQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<ProductTypeDto?> Handle(GetProductTypeByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.ProductTypes
            .Where(pt => pt.Id == request.Id)
            .Select(pt => new ProductTypeDto
            {
                Id = pt.Id,
                Name = pt.Name,
                Description = pt.Description,
                UrlSlug = pt.SeoMetadata.UrlSlug,
                MetaTitle = pt.SeoMetadata.MetaTitle,
                MetaDescription = pt.SeoMetadata.MetaDescription,
                CreatedAt = pt.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
