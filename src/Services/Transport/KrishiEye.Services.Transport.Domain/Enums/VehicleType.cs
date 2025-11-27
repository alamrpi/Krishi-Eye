namespace KrishiEye.Services.Transport.Domain.Enums;

/// <summary>
/// Defines the types of vehicles available in the transport system
/// </summary>
public enum VehicleType
{
    /// <summary>
    /// Pickup truck with 1 ton capacity
    /// </summary>
    Pickup_1Ton = 1,

    /// <summary>
    /// Truck with 3 ton capacity
    /// </summary>
    Truck_3Ton = 2,

    /// <summary>
    /// Truck with 5 ton capacity
    /// </summary>
    Truck_5Ton = 3,

    /// <summary>
    /// Covered van for protected cargo
    /// </summary>
    CoveredVan = 4,

    /// <summary>
    /// Large trailer for heavy loads
    /// </summary>
    Trailer = 5
}
