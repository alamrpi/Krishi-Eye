namespace KrishiEye.Services.Transport.Domain.Enums;

/// <summary>
/// Defines the operational status of a driver in the system
/// </summary>
public enum DriverStatus
{
    /// <summary>
    /// Driver is active and available for assignments
    /// </summary>
    Active = 1,

    /// <summary>
    /// Driver is temporarily inactive (on leave, unavailable)
    /// </summary>
    Inactive = 2,

    /// <summary>
    /// Driver is currently assigned to an active job
    /// </summary>
    OnDuty = 3,

    /// <summary>
    /// Driver has been banned from the system
    /// </summary>
    Banned = 4,

    /// <summary>
    /// Driver's license has expired and needs renewal
    /// </summary>
    LicenseExpired = 5
}
