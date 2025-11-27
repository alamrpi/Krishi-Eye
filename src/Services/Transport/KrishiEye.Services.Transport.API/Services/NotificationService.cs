using KrishiEye.Services.Transport.API.Hubs;
using KrishiEye.Services.Transport.Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace KrishiEye.Services.Transport.API.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<TransportHub> _hubContext;

    public NotificationService(IHubContext<TransportHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyNewBid(Guid requestId, Guid bidId, decimal bidAmount, string transporterName)
    {
        await _hubContext.Clients
            .Group($"request_{requestId}")
            .SendAsync("NewBid", new
            {
                BidId = bidId,
                RequestId = requestId,
                BidAmount = bidAmount,
                TransporterName = transporterName,
                Timestamp = DateTime.UtcNow
            });
    }

    public async Task NotifyNewRequest(Guid transporterId, Guid requestId, string pickupAddress, double distanceKm)
    {
        await _hubContext.Clients
            .Group($"transporter_{transporterId}")
            .SendAsync("NewRequest", new
            {
                RequestId = requestId,
                PickupAddress = pickupAddress,
                DistanceKm = distanceKm,
                Timestamp = DateTime.UtcNow
            });
    }

    public async Task NotifyBidAccepted(Guid transporterId, Guid requestId, Guid bidId)
    {
        await _hubContext.Clients
            .Group($"transporter_{transporterId}")
            .SendAsync("BidAccepted", new
            {
                BidId = bidId,
                RequestId = requestId,
                Timestamp = DateTime.UtcNow
            });
    }

    public async Task NotifyJobStatusUpdate(Guid requestId, string status, string? message = null)
    {
        await _hubContext.Clients
            .Group($"request_{requestId}")
            .SendAsync("JobStatusUpdate", new
            {
                RequestId = requestId,
                Status = status,
                Message = message,
                Timestamp = DateTime.UtcNow
            });
    }

    public async Task SendLocationUpdate(Guid requestId, double latitude, double longitude)
    {
        await _hubContext.Clients
            .Group($"request_{requestId}")
            .SendAsync("LocationUpdate", new
            {
                RequestId = requestId,
                Latitude = latitude,
                Longitude = longitude,
                Timestamp = DateTime.UtcNow
            });
    }
}
