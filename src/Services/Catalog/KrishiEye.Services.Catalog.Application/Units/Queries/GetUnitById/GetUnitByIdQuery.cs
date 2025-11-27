using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Application.Units.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Units.Queries.GetUnitById;

public record GetUnitByIdQuery(Guid Id) : IRequest<UnitDto?>;

public class GetUnitByIdQueryHandler : IRequestHandler<GetUnitByIdQuery, UnitDto?>
{
    private readonly ICatalogDbContext _context;

    public GetUnitByIdQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<UnitDto?> Handle(GetUnitByIdQuery request, CancellationToken cancellationToken)
    {
        var unit = await _context.MeasurementUnits
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (unit == null)
            return null;

        return new UnitDto
        {
            Id = unit.Id,
            Name = unit.Name,
            Symbol = unit.Symbol,
            UnitType = unit.UnitType,
            CreatedAt = unit.CreatedAt
        };
    }
}
