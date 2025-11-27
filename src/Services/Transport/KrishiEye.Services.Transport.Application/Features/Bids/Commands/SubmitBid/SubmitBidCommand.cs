using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.Enums;
using KrishiEye.Services.Transport.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Bids.Commands.SubmitBid;

public record SubmitBidCommand : IRequest<Result<Guid>>
{
    public Guid RequestId { get; init; }
    public decimal BidAmount { get; init; }
    public string? Note { get; init; }
}

public class SubmitBidCommandHandler : IRequestHandler<SubmitBidCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public SubmitBidCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Result<Guid>> Handle(SubmitBidCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<Guid>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<Guid>("Transporter profile not found. Please create a profile first.");
        }

        // Verify transport request exists and is open for bidding
        var transportRequest = await _context.TransportRequests
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);

        if (transportRequest == null)
        {
            return Result.Failure<Guid>("Transport request not found.");
        }

        if (transportRequest.Status != RequestStatus.Open && transportRequest.Status != RequestStatus.Bidding)
        {
            return Result.Failure<Guid>("This request is no longer accepting bids.");
        }

        // Check if transporter already has a bid for this request
        var existingBid = await _context.TransportBids
            .FirstOrDefaultAsync(b => b.RequestId == request.RequestId && b.TransporterId == transporter.Id, cancellationToken);

        if (existingBid != null)
        {
            return Result.Failure<Guid>("You have already submitted a bid for this request.");
        }

        var bid = TransportBid.Create(request.RequestId, transporter.Id, request.BidAmount, request.Note);

        _context.TransportBids.Add(bid);
        await _context.SaveChangesAsync(cancellationToken);

        // Send real-time notification to requester
        await _notificationService.NotifyNewBid(
            request.RequestId, 
            bid.Id, 
            request.BidAmount, 
            transporter.Name);

        return Result.Success(bid.Id);
    }
}
