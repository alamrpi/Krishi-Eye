using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.ProductTypes.Commands.DeleteProductType;

public record DeleteProductTypeCommand(Guid Id) : IRequest<MediatR.Unit>;

public class DeleteProductTypeCommandHandler : IRequestHandler<DeleteProductTypeCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public DeleteProductTypeCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(DeleteProductTypeCommand request, CancellationToken cancellationToken)
    {
        var productType = await _context.ProductTypes
            .FirstOrDefaultAsync(pt => pt.Id == request.Id, cancellationToken);

        if (productType == null)
            throw new InvalidOperationException($"ProductType with ID {request.Id} not found");

        // Check if any products or categories are using this ProductType
        var hasProducts = await _context.Products.AnyAsync(p => p.ProductTypeId == request.Id, cancellationToken);
        var hasCategories = await _context.Categories.AnyAsync(c => c.ProductTypeId == request.Id, cancellationToken);

        if (hasProducts || hasCategories)
            throw new InvalidOperationException("Cannot delete ProductType that is being used by products or categories");

        _context.ProductTypes.Remove(productType);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
