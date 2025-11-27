namespace KrishiEye.Services.Transport.Domain.Enums;

/// <summary>
/// Defines the lifecycle status of a transport request
/// </summary>
public enum RequestStatus
{
    /// <summary>
    /// Request has been created and is open for bidding
    /// </summary>
    Open = 1,

    /// <summary>
    /// Request is actively receiving bids from transporters
    /// </summary>
    Bidding = 2,

    /// <summary>
    /// A bid has been accepted and job is confirmed
    /// </summary>
    Confirmed = 3,

    /// <summary>
    /// Goods are loaded and vehicle is in transit
    /// </summary>
    InTransit = 4,

    /// <summary>
    /// Goods have been delivered successfully
    /// </summary>
    Completed = 5,

    /// <summary>
    /// Request was cancelled by the requester
    /// </summary>
    Cancelled = 6
}
