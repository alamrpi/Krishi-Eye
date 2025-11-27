using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using KrishiEye.Services.Transport.Domain.ValueObjects;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents a transporter profile (Agency or Individual)
/// </summary>
public class TransporterProfile : BaseEntity
{
    /// <summary>
    /// Reference to the user in the Identity Service
    /// </summary>
    public Guid UserId { get; private set; }

    /// <summary>
    /// Name of the transporter or agency
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Contact number
    /// </summary>
    public string ContactNumber { get; private set; } = string.Empty;

    /// <summary>
    /// Type of transporter (Individual or Agency)
    /// </summary>
    public TransporterType Type { get; private set; }

    /// <summary>
    /// Trade license number for verification (only for Agency)
    /// </summary>
    public string? TradeLicenseNumber { get; private set; }

    /// <summary>
    /// Base location (garage/office location)
    /// </summary>
    public Location Location { get; private set; } = null!;

    /// <summary>
    /// Service radius in kilometers (for geo-filtering notifications)
    /// </summary>
    public int ServiceRadiusKm { get; private set; } = 50;

    /// <summary>
    /// Whether the transporter has been verified by admin
    /// </summary>
    public bool IsVerified { get; private set; } = false;

    /// <summary>
    /// Average rating from completed jobs
    /// </summary>
    public decimal Rating { get; private set; } = 0.0m;

    /// <summary>
    /// Total number of completed jobs
    /// </summary>
    public int TotalJobs { get; private set; } = 0;

    // Navigation properties
    public ICollection<Driver> Drivers { get; private set; } = new List<Driver>();
    public ICollection<Vehicle> Vehicles { get; private set; } = new List<Vehicle>();
    public ICollection<TransportBid> Bids { get; private set; } = new List<TransportBid>();

    private TransporterProfile() { } // For EF Core

    public TransporterProfile(
        Guid userId,
        string name,
        string contactNumber,
        TransporterType type,
        string? tradeLicenseNumber,
        Location location)
    {
        UserId = userId;
        Name = name;
        ContactNumber = contactNumber;
        Type = type;
        TradeLicenseNumber = tradeLicenseNumber;
        Location = location;
    }
}
