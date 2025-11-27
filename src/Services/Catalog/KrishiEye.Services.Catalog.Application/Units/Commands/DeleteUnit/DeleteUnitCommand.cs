using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Units.Commands.DeleteUnit;

public record DeleteUnitCommand(Guid Id) : IRequest<MediatR.Unit>;

public class DeleteUnitCommandHandler : IRequestHandler<DeleteUnitCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public DeleteUnitCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(DeleteUnitCommand request, CancellationToken cancellationToken)
    {
        var unit = await _context.MeasurementUnits
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (unit == null)
            throw new InvalidOperationException($"MeasurementUnit with ID {request.Id} not found");

        _context.MeasurementUnits.Remove(unit);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
