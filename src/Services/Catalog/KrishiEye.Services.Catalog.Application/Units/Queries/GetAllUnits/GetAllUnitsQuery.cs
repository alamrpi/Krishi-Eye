using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Application.Units.Common;
using Microsoft.EntityFrameworkCore;
using MediatR;

namespace KrishiEye.Services.Catalog.Application.Units.Queries.GetAllUnits;

public record GetAllUnitsQuery : IRequest<List<UnitDto>>;

public class GetAllUnitsQueryHandler : IRequestHandler<GetAllUnitsQuery, List<UnitDto>>
{
    private readonly ICatalogDbContext _context;

    public GetAllUnitsQueryHandler(ICatalogDbContext context)
    {
        _context = context;
    }

    public async Task<List<UnitDto>> Handle(GetAllUnitsQuery request, CancellationToken cancellationToken)
    {
        return await _context.MeasurementUnits
            .Select(u => new UnitDto
            {
                Id = u.Id,
                Name = u.Name,
                Symbol = u.Symbol,
                UnitType = u.UnitType,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
