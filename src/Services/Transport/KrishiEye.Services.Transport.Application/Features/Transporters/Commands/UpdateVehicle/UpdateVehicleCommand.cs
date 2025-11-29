using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.UpdateVehicle;

public record UpdateVehicleCommand : IRequest<Result<bool>>
{
    public Guid VehicleId { get; init; }
    public VehicleType Type { get; init; }
    public string RegistrationNumber { get; init; } = string.Empty;
    public decimal CapacityTon { get; init; }
    public string? Model { get; init; }
    public int? ManufactureYear { get; init; }
    public DateTime FitnessExpiryDate { get; init; }
}

public class UpdateVehicleCommandHandler : IRequestHandler<UpdateVehicleCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateVehicleCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(UpdateVehicleCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<bool>("User is not authenticated.");
        }

        // Find the vehicle
        var vehicle = await _context.Vehicles
            .Include(v => v.Transporter)
            .FirstOrDefaultAsync(v => v.Id == request.VehicleId, cancellationToken);

        if (vehicle == null)
        {
            return Result.Failure<bool>("Vehicle not found.");
        }

        // Check if vehicle belongs to current user's transporter
        if (vehicle.Transporter.UserId != userId)
        {
            return Result.Failure<bool>("You do not have permission to update this vehicle.");
        }

        // Update vehicle fields
        vehicle.Type = request.Type;
        vehicle.RegNumber = request.RegistrationNumber;
        vehicle.CapacityTon = request.CapacityTon;
        vehicle.Model = request.Model;
        vehicle.ManufactureYear = request.ManufactureYear;
        vehicle.FitnessExpiryDate = request.FitnessExpiryDate;

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(true);
    }
}
