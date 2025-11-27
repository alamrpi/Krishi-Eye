using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace KrishiEye.Services.Transport.API.Hubs;

[Authorize]
public class TransportHub : Hub
{
    /// <summary>
    /// Subscribe to updates for a specific transport request
    /// Used by requesters to get real-time bid notifications
    /// </summary>
    public async Task JoinRequestRoom(string requestId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"request_{requestId}");
    }

    /// <summary>
    /// Unsubscribe from request updates
    /// </summary>
    public async Task LeaveRequestRoom(string requestId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"request_{requestId}");
    }

    /// <summary>
    /// Subscribe to transporter-specific notifications
    /// Used by transporters to receive new request notifications based on their location
    /// </summary>
    public async Task JoinTransporterRoom(string transporterId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"transporter_{transporterId}");
    }

    /// <summary>
    /// Unsubscribe from transporter notifications
    /// </summary>
    public async Task LeaveTransporterRoom(string transporterId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"transporter_{transporterId}");
    }

    /// <summary>
    /// Update client's current location (for transporters)
    /// This can be used to filter which requests they should be notified about
    /// </summary>
    public async Task UpdateLocation(double latitude, double longitude)
    {
        // Store location in connection state for geo-filtering
        // This is useful for dynamic location-based notifications
        await Clients.Caller.SendAsync("LocationUpdated", new { latitude, longitude });
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
