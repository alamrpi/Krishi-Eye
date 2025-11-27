using KrishiEye.Services.Catalog.Application.Categories.Common;
using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Categories.Queries.GetAllCategories;

public record GetAllCategoriesQuery(Guid? ProductTypeId = null) : IRequest<List<CategoryDto>>;

public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, List<CategoryDto>>
{
    private readonly ICatalogDbContext _context;

    public GetAllCategoriesQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Categories.AsQueryable();

        if (request.ProductTypeId.HasValue)
            query = query.Where(c => c.ProductTypeId == request.ProductTypeId.Value);

        return await query
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ProductTypeId = c.ProductTypeId,
                ParentCategoryId = c.ParentCategoryId,
                UrlSlug = c.SeoMetadata.UrlSlug,
                MetaTitle = c.SeoMetadata.MetaTitle,
                MetaDescription = c.SeoMetadata.MetaDescription,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
