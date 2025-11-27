using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Units.Commands.CreateUnit;

public record CreateUnitCommand(
    string Name,
    string Symbol,
    UnitType UnitType) : IRequest<Guid>;

public class CreateUnitCommandHandler : IRequestHandler<CreateUnitCommand, Guid>
{
    private readonly ICatalogDbContext _context;

    public CreateUnitCommandHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateUnitCommand request, CancellationToken cancellationToken)
    {
        var unit = MeasurementUnit.Create(request.Name, request.Symbol, request.UnitType);
        
        _context.MeasurementUnits.Add(unit);
        await _context.SaveChangesAsync(cancellationToken);

        return unit.Id;
    }
}
