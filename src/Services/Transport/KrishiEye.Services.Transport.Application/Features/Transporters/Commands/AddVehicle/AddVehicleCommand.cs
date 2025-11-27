using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddVehicle;

public record AddVehicleCommand : IRequest<Result<Guid>>
{
    public VehicleType Type { get; init; }
    public string RegistrationNumber { get; init; } = string.Empty;
    public decimal CapacityTon { get; init; }
    public string? Model { get; init; }
    public int? ManufactureYear { get; init; }
    public DateTime FitnessExpiryDate { get; init; }
}

public class AddVehicleCommandHandler : IRequestHandler<AddVehicleCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddVehicleCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<Guid>> Handle(AddVehicleCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<Guid>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<Guid>("Transporter profile not found. Please create a profile first.");
        }

        var vehicle = new Vehicle
        {
            Id = Guid.NewGuid(),
            TransporterId = transporter.Id,
            Type = request.Type,
            RegNumber = request.RegistrationNumber,
            CapacityTon = request.CapacityTon,
            Model = request.Model,
            ManufactureYear = request.ManufactureYear,
            FitnessExpiryDate = request.FitnessExpiryDate
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(vehicle.Id);
    }
}
