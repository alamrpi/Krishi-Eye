using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetVehicles;

public record GetVehiclesQuery : IRequest<Result<List<VehicleDto>>>
{
}

public class VehicleDto
{
    public Guid Id { get; set; }
    public VehicleType Type { get; set; }
    public string RegNumber { get; set; } = string.Empty;
    public decimal CapacityTon { get; set; }
    public string? Model { get; set; }
    public int? ManufactureYear { get; set; }
    public DateTime FitnessExpiryDate { get; set; }
    public bool IsAvailable { get; set; }
}

public class GetVehiclesQueryHandler : IRequestHandler<GetVehiclesQuery, Result<List<VehicleDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetVehiclesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<VehicleDto>>> Handle(GetVehiclesQuery request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<List<VehicleDto>>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<List<VehicleDto>>("Transporter profile not found.");
        }

        // Get all vehicles for this transporter
        var vehicles = await _context.Vehicles
            .Where(v => v.TransporterId == transporter.Id)
            .Select(v => new VehicleDto
            {
                Id = v.Id,
                Type = v.Type,
                RegNumber = v.RegNumber,
                CapacityTon = v.CapacityTon,
                Model = v.Model,
                ManufactureYear = v.ManufactureYear,
                FitnessExpiryDate = v.FitnessExpiryDate,
                IsAvailable = v.Status == VehicleStatus.Active
            })
            .ToListAsync(cancellationToken);

        return Result.Success(vehicles);
    }
}
