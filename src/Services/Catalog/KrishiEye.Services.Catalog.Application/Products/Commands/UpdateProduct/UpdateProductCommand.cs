using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Products.Commands.UpdateProduct;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    string? ImageUrl) : IRequest<MediatR.Unit>;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public UpdateProductCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);

        if (product == null)
            throw new InvalidOperationException($"Product with ID {request.Id} not found");

        // Update price using domain method
        var newPrice = Money.Create(request.Price, request.Currency);
        product.UpdatePrice(newPrice);

        // Update stock if changed
        var stockDiff = request.StockQuantity - product.StockQuantity;
        if (stockDiff > 0)
            product.AddStock(stockDiff);
        else if (stockDiff < 0)
            product.RemoveStock(Math.Abs(stockDiff));

        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
