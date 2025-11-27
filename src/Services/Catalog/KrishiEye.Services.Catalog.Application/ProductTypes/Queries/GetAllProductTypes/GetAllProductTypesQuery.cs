using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.ProductTypes.Queries.GetAllProductTypes;

public record GetAllProductTypesQuery : IRequest<List<ProductTypeDto>>;

public class GetAllProductTypesQueryHandler : IRequestHandler<GetAllProductTypesQuery, List<ProductTypeDto>>
{
    private readonly ICatalogDbContext _context;

    public GetAllProductTypesQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductTypeDto>> Handle(GetAllProductTypesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ProductTypes
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
            .ToListAsync(cancellationToken);
    }
}

public class ProductTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string UrlSlug { get; set; } = string.Empty;
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
