using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Jobs.Commands.UpdateLocation;

public record UpdateLocationCommand : IRequest<Result<bool>>
{
    public Guid RequestId { get; init; }
    public double Latitude { get; init; }
    public double Longitude { get; init; }
}

public class UpdateLocationCommandHandler : IRequestHandler<UpdateLocationCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public UpdateLocationCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Result<bool>> Handle(UpdateLocationCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<bool>("User is not authenticated.");
        }

        // Find the transport request
        var transportRequest = await _context.TransportRequests
            .Include(r => r.Bids)
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);

        if (transportRequest == null)
        {
            return Result.Failure<bool>("Transport request not found.");
        }

        // Verify the current user is the winning transporter
        var winningBid = transportRequest.Bids.FirstOrDefault(b => b.Id == transportRequest.WinnerBidId);
        if (winningBid == null)
        {
            return Result.Failure<bool>("No winning bid found for this request.");
        }

        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.Id == winningBid.TransporterId, cancellationToken);

        if (transporter == null || transporter.UserId != userId)
        {
            return Result.Failure<bool>("You are not authorized to update location for this request.");
        }

        // Send real-time location update (no database persistence needed)
        await _notificationService.SendLocationUpdate(
            request.RequestId,
            request.Latitude,
            request.Longitude);

        return Result.Success(true);
    }
}
