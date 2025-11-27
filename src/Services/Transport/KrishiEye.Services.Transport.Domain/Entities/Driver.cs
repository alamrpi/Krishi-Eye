using KrishiEye.Services.Transport.Domain.Enums;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents a driver associated with a transporter
/// </summary>
public class Driver
{
    public Guid Id { get; set; }

    /// <summary>
    /// Reference to the transporter who employs this driver
    /// </summary>
    public Guid TransporterId { get; set; }

    /// <summary>
    /// Full name of the driver (as per NID)
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Contact phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Driving license number (unique)
    /// </summary>
    public string LicenseNumber { get; set; } = string.Empty;

    /// <summary>
    /// License expiry date (for validation before job assignment)
    /// </summary>
    public DateTime LicenseExpiryDate { get; set; }

    /// <summary>
    /// URL to scanned copy of driving license (stored in S3)
    /// </summary>
    public string LicenseImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// National ID card number
    /// </summary>
    public string NidNumber { get; set; } = string.Empty;

    /// <summary>
    /// Driver's current operational status
    /// </summary>
    public DriverStatus Status { get; set; } = DriverStatus.Active;

    /// <summary>
    /// Date when driver was added to the system
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when driver info was last updated
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public TransporterProfile Transporter { get; set; } = null!;
    // public ICollection<JobAssignment> JobAssignments { get; set; } = new List<JobAssignment>(); // Will be added in Task 1.3

    /// <summary>
    /// Check if driver's license is currently valid
    /// </summary>
    public bool IsLicenseValid()
    {
        return LicenseExpiryDate > DateTime.UtcNow;
    }

    /// <summary>
    /// Check if driver is available for job assignment
    /// </summary>
    public bool IsAvailableForAssignment()
    {
        return Status == DriverStatus.Active && IsLicenseValid();
    }
}
