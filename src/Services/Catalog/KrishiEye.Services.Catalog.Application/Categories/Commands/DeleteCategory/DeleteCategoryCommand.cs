using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest<MediatR.Unit>;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public DeleteCategoryCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
            throw new InvalidOperationException($"Category with ID {request.Id} not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
