using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Jobs.Commands.StartTransit;

public record StartTransitCommand : IRequest<Result<Guid>>
{
    public Guid RequestId { get; init; }
}

public class StartTransitCommandHandler : IRequestHandler<StartTransitCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public StartTransitCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Result<Guid>> Handle(StartTransitCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<Guid>("User is not authenticated.");
        }

        // Find the transport request
        var transportRequest = await _context.TransportRequests
            .Include(r => r.Bids)
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);

        if (transportRequest == null)
        {
            return Result.Failure<Guid>("Transport request not found.");
        }

        // Verify the current user is the winning transporter
        var winningBid = transportRequest.Bids.FirstOrDefault(b => b.Id == transportRequest.WinnerBidId);
        if (winningBid == null)
        {
            return Result.Failure<Guid>("No winning bid found for this request.");
        }

        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.Id == winningBid.TransporterId, cancellationToken);

        if (transporter == null || transporter.UserId != userId)
        {
            return Result.Failure<Guid>("You are not authorized to start transit for this request.");
        }

        // Start transit
        transportRequest.StartTransit();
        await _context.SaveChangesAsync(cancellationToken);

        // Send real-time notification
        await _notificationService.NotifyJobStatusUpdate(
            request.RequestId,
            "InTransit",
            "The transporter has picked up your goods and is on the way.");

        return Result.Success(transportRequest.Id);
    }
}
