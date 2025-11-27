using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Bids.Commands.AcceptBid;

public record AcceptBidCommand : IRequest<Result<Guid>>
{
    public Guid BidId { get; init; }
}

public class AcceptBidCommandHandler : IRequestHandler<AcceptBidCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public AcceptBidCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Result<Guid>> Handle(AcceptBidCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<Guid>("User is not authenticated.");
        }

        // Find the bid with related entities
        var bid = await _context.TransportBids
            .Include(b => b.Request)
            .FirstOrDefaultAsync(b => b.Id == request.BidId, cancellationToken);

        if (bid == null)
        {
            return Result.Failure<Guid>("Bid not found.");
        }

        // Verify the current user is the requester who owns this transport request
        if (bid.Request.RequesterId != userId)
        {
            return Result.Failure<Guid>("You are not authorized to accept this bid.");
        }

        // Verify request is still accepting bids
        if (bid.Request.Status != RequestStatus.Open && bid.Request.Status != RequestStatus.Bidding)
        {
            return Result.Failure<Guid>("This request is no longer accepting bids.");
        }

        // Accept the bid
        bid.Accept();
        
        // Update request status and set winner
        bid.Request.AcceptBid(bid.Id);

        // Reject all other bids for this request
        var otherBids = await _context.TransportBids
            .Where(b => b.RequestId == bid.RequestId && b.Id != bid.Id && b.Status == BidStatus.Pending)
            .ToListAsync(cancellationToken);

        foreach (var otherBid in otherBids)
        {
            otherBid.Reject();
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Send real-time notification to winning transporter
        await _notificationService.NotifyBidAccepted(
            bid.TransporterId, 
            bid.RequestId, 
            bid.Id);

        return Result.Success(bid.Request.Id);
    }
}
