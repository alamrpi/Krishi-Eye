using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(
    string Name,
    string Description,
    Guid ProductTypeId,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription,
    Guid? ParentCategoryId = null) : IRequest<Guid>;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly ICatalogDbContext _context;

    public CreateCategoryCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var seoMetadata = SeoMetadata.Create(
            request.UrlSlug,
            request.MetaTitle,
            request.MetaDescription);

        var category = Category.Create(
            request.Name,
            request.Description,
            request.ProductTypeId,
            seoMetadata,
            request.ParentCategoryId);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
