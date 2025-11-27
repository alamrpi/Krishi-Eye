using KrishiEye.Services.Transport.Domain.Common;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents the assignment of a driver and vehicle to a confirmed transport request
/// Links Request -> Driver -> Vehicle
/// </summary>
public class JobAssignment : BaseEntity
{
    public Guid RequestId { get; private set; }
    public Guid VehicleId { get; private set; }
    public Guid DriverId { get; private set; }
    public DateTime AssignedAt { get; private set; }
    
    // Navigation properties
    public TransportRequest Request { get; private set; } = null!;
    public Vehicle Vehicle { get; private set; } = null!;
   public Driver Driver { get; private set; } = null!;

    private JobAssignment() { } // EF Core constructor

    private JobAssignment(
        Guid requestId,
        Guid vehicleId,
        Guid driverId)
    {
        Id = Guid.NewGuid();
        RequestId = requestId;
        VehicleId = vehicleId;
        DriverId = driverId;
        AssignedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Factory method to create a job assignment with validation
    /// </summary>
    public static JobAssignment Create(
        Guid requestId,
        Guid vehicleId,
        Guid driverId,
        Vehicle vehicle,
        Driver driver,
        TransportRequest request)
    {
        // Guard clauses
        if (requestId == Guid.Empty)
            throw new ArgumentException("Request ID cannot be empty", nameof(requestId));
        
        if (vehicleId == Guid.Empty)
            throw new ArgumentException("Vehicle ID cannot be empty", nameof(vehicleId));
        
        if (driverId == Guid.Empty)
            throw new ArgumentException("Driver ID cannot be empty", nameof(driverId));

        // Business Rules Validation
        if (!vehicle.IsAvailableForAssignment())
            throw new InvalidOperationException("Vehicle is not available for assignment");

        if (!driver.IsAvailableForAssignment())
            throw new InvalidOperationException("Driver is not available for assignment (check license validity)");

        if (!vehicle.CanCarryWeight(request.WeightKg))
            throw new InvalidOperationException($"Vehicle capacity ({vehicle.CapacityTon}T) cannot carry requested weight ({request.WeightKg}kg)");

        return new JobAssignment(requestId, vehicleId, driverId);
    }

    /// <summary>
    /// Validate assignment before starting transit
    /// </summary>
    public bool IsValid()
    {
        return RequestId != Guid.Empty && 
               VehicleId != Guid.Empty && 
               DriverId != Guid.Empty;
    }
}
