using KrishiEye.Services.Transport.Domain.Enums;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents a vehicle owned by a transporter
/// </summary>
public class Vehicle
{
    public Guid Id { get; set; }

    /// <summary>
    /// Reference to the transporter who owns this vehicle
    /// </summary>
    public Guid TransporterId { get; set; }

    /// <summary>
    /// Vehicle registration number (e.g., "Dhaka-Metro-Ta-11-1234")
    /// </summary>
    public string RegNumber { get; set; } = string.Empty;

    /// <summary>
    /// Type of vehicle
    /// </summary>
    public VehicleType Type { get; set; }

    /// <summary>
    /// Maximum load capacity in tons
    /// </summary>
    public decimal CapacityTon { get; set; }

    /// <summary>
    /// Fitness certificate expiry date
    /// </summary>
    public DateTime FitnessExpiryDate { get; set; }

    /// <summary>
    /// JSON object containing URLs to vehicle documents (bluebook, fitness certificate, etc.)
    /// Stored as: { "bluebook": "url1", "fitness": "url2", "insurance": "url3" }
    /// </summary>
    public string? DocumentsUrl { get; set; }

    /// <summary>
    /// Vehicle model/make (optional)
    /// </summary>
    public string? Model { get; set; }

    /// <summary>
    /// Year of manufacture (optional)
    /// </summary>
    public int? ManufactureYear { get; set; }

    /// <summary>
    /// Current status of the vehicle
    /// </summary>
    public VehicleStatus Status { get; set; } = VehicleStatus.Active;

    /// <summary>
    /// Date when vehicle was added to the system
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when vehicle info was last updated
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public TransporterProfile Transporter { get; set; } = null!;
    // public ICollection<JobAssignment> JobAssignments { get; set; } = new List<JobAssignment>(); // Will be added in Task 1.3

    /// <summary>
    /// Check if vehicle's fitness certificate is currently valid
    /// </summary>
    public bool IsFitnessValid()
    {
        return FitnessExpiryDate > DateTime.UtcNow;
    }

    /// <summary>
    /// Check if vehicle is available for job assignment
    /// </summary>
    public bool IsAvailableForAssignment()
    {
        return Status == VehicleStatus.Active && IsFitnessValid();
    }

    /// <summary>
    /// Check if vehicle can carry the specified weight
    /// </summary>
    public bool CanCarryWeight(decimal weightKg)
    {
        return (weightKg / 1000m) <= CapacityTon;
    }
}

/// <summary>
/// Defines the operational status of a vehicle
/// </summary>
public enum VehicleStatus
{
    /// <summary>
    /// Vehicle is active and available
    /// </summary>
    Active = 1,

    /// <summary>
    /// Vehicle is under maintenance
    /// </summary>
    Maintenance = 2,

    /// <summary>
    /// Vehicle is currently on a trip
    /// </summary>
    InTrip = 3,

    /// <summary>
    /// Vehicle is inactive/retired
    /// </summary>
    Inactive = 4
}
