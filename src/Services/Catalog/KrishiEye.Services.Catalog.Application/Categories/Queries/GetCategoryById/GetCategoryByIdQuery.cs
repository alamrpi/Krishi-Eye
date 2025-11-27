using KrishiEye.Services.Catalog.Application.Categories.Common;
using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Categories.Queries.GetCategoryById;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>;

public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly ICatalogDbContext _context;

    public GetCategoryByIdQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .Include(c => c.ProductType)
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ProductTypeId = category.ProductTypeId,
            ProductTypeName = category.ProductType?.Name ?? string.Empty,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = category.ParentCategory?.Name,
            UrlSlug = category.SeoMetadata.UrlSlug,
            MetaTitle = category.SeoMetadata.MetaTitle,
            MetaDescription = category.SeoMetadata.MetaDescription,
            CreatedAt = category.CreatedAt
        };
    }
}
