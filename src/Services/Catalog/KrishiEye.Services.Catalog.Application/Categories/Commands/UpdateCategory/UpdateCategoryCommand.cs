using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(
    Guid Id,
    string Name,
    string Description,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription) : IRequest<MediatR.Unit>;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public UpdateCategoryCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
            throw new InvalidOperationException($"Category with ID {request.Id} not found");

        // Remove old and create new (since entities are immutable)
        _context.Categories.Remove(category);

        var seoMetadata = SeoMetadata.Create(
            request.UrlSlug,
            request.MetaTitle,
            request.MetaDescription);

        var updatedCategory = Domain.Entities.Category.Create(
            request.Name,
            request.Description,
            category.ProductTypeId,
            seoMetadata,
            category.ParentCategoryId);

        _context.Categories.Add(updatedCategory);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
