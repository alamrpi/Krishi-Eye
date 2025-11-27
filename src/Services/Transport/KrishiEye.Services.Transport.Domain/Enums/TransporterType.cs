namespace KrishiEye.Services.Transport.Domain.Enums;

/// <summary>
/// Defines the type of transporter in the system
/// </summary>
public enum TransporterType
{
    /// <summary>
    /// Individual transporter (single truck owner/driver)
    /// </summary>
    Individual = 1,

    /// <summary>
    /// Transport agency with multiple vehicles and drivers
    /// </summary>
    Agency = 2
}
