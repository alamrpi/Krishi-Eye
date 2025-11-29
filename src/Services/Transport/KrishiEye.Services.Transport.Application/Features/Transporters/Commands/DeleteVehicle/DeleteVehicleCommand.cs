using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.DeleteVehicle;

public record DeleteVehicleCommand : IRequest<Result<bool>>
{
    public Guid VehicleId { get; init; }
}

public class DeleteVehicleCommandHandler : IRequestHandler<DeleteVehicleCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteVehicleCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
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
            return Result.Failure<bool>("You do not have permission to delete this vehicle.");
        }

        // Check if vehicle is used in any job assignments
        var isUsedInJobs = await _context.JobAssignments
            .AnyAsync(j => j.VehicleId == request.VehicleId, cancellationToken);

        if (isUsedInJobs)
        {
            return Result.Failure<bool>("Cannot delete vehicle. Vehicle is assigned to one or more jobs.");
        }

        // Delete the vehicle
        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(true);
    }
}
