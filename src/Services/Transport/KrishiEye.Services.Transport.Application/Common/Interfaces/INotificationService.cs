namespace KrishiEye.Services.Transport.Application.Common.Interfaces;

/// <summary>
/// Service for sending real-time notifications via SignalR
/// </summary>
public interface INotificationService
{
    /// <summary>
    /// Notify a requester that a new bid has been submitted
    /// </summary>
    Task NotifyNewBid(Guid requestId, Guid bidId, decimal bidAmount, string transporterName);

    /// <summary>
    /// Notify a transporter that a new transport request is available nearby
    /// </summary>
    Task NotifyNewRequest(Guid transporterId, Guid requestId, string pickupAddress, double distanceKm);

    /// <summary>
    /// Notify a requester that their bid has been accepted
    /// </summary>
    Task NotifyBidAccepted(Guid transporterId, Guid requestId, Guid bidId);

    /// <summary>
    /// Notify both parties about job status updates
    /// </summary>
    Task NotifyJobStatusUpdate(Guid requestId, string status, string? message = null);

    /// <summary>
    /// Send live location updates during transit
    /// </summary>
    Task SendLocationUpdate(Guid requestId, double latitude, double longitude);
}
