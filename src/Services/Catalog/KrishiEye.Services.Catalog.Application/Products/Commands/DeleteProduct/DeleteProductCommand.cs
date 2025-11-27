using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Products.Commands.DeleteProduct;

public record DeleteProductCommand(Guid Id) : IRequest<MediatR.Unit>;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public DeleteProductCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
            throw new InvalidOperationException($"Product with ID {request.Id} not found");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
