using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Units.Commands.UpdateUnit;

public record UpdateUnitCommand(
    Guid Id,
    string Name,
    string Symbol,
    UnitType UnitType) : IRequest<MediatR.Unit>;

public class UpdateUnitCommandHandler : IRequestHandler<UpdateUnitCommand, MediatR.Unit>
{
    private readonly ICatalogDbContext _context;

    public UpdateUnitCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<MediatR.Unit> Handle(UpdateUnitCommand request, CancellationToken cancellationToken)
    {
        var unit = await _context.MeasurementUnits
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (unit == null)
            throw new InvalidOperationException($"MeasurementUnit with ID {request.Id} not found");

        // Remove old and create new (since entities are immutable)
        _context.MeasurementUnits.Remove(unit);

        var updatedUnit = Domain.Entities.MeasurementUnit.Create(
            request.Name,
            request.Symbol,
            request.UnitType);

        _context.MeasurementUnits.Add(updatedUnit);
        await _context.SaveChangesAsync(cancellationToken);

        return MediatR.Unit.Value;
    }
}
