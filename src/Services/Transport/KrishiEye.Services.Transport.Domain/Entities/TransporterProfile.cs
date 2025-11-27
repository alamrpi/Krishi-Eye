using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents a transporter profile (Agency or Individual)
/// </summary>
public class TransporterProfile : BaseEntity
{
    /// <summary>
    /// Reference to the user in the Identity Service
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Type of transporter (Individual or Agency)
    /// </summary>
    public TransporterType Type { get; set; }

    /// <summary>
    /// Company name (only for Agency type)
    /// </summary>
    public string? CompanyName { get; set; }

    /// <summary>
    /// Trade license number for verification (only for Agency)
    /// </summary>
    public string? TradeLicenseNo { get; set; }

    /// <summary>
    /// Base location latitude (garage/office location)
    /// </summary>
    public decimal BaseLatitude { get; set; }

    /// <summary>
    /// Base location longitude (garage/office location)
    /// </summary>
    public decimal BaseLongitude { get; set; }

    /// <summary>
    /// Service radius in kilometers (for geo-filtering notifications)
    /// </summary>
    public int ServiceRadiusKm { get; set; } = 50;

    /// <summary>
    /// Whether the transporter has been verified by admin
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Average rating from completed jobs
    /// </summary>
    public decimal Rating { get; set; } = 0.0m;

    /// <summary>
    /// Total number of completed jobs
    /// </summary>
    public int TotalJobs { get; set; } = 0;

    // Navigation properties
    public ICollection<Driver> Drivers { get; set; } = new List<Driver>();
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    public ICollection<TransportBid> Bids { get; set; } = new List<TransportBid>();
}
