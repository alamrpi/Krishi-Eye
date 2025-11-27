using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Jobs.Commands.CompleteDelivery;

public record CompleteDeliveryCommand : IRequest<Result<Guid>>
{
    public Guid RequestId { get; init; }
    public bool MarkCashReceived { get; init; } = true; // Default true for cash payments
}

public class CompleteDeliveryCommandHandler : IRequestHandler<CompleteDeliveryCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public CompleteDeliveryCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        INotificationService notificationService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task<Result<Guid>> Handle(CompleteDeliveryCommand request, CancellationToken cancellationToken)
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
            return Result.Failure<Guid>("You are not authorized to complete this delivery.");
        }

        // Complete delivery
        transportRequest.Complete();
        
        // Mark cash as received if applicable
        if (request.MarkCashReceived && transportRequest.PaymentMethod == Domain.Enums.PaymentMethod.Cash)
        {
            transportRequest.MarkCashReceived();
        }
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send real-time notification
        await _notificationService.NotifyJobStatusUpdate(
            request.RequestId,
            "Completed",
            request.MarkCashReceived 
                ? "Your goods have been successfully delivered! Cash payment received." 
                : "Your goods have been successfully delivered!");

        return Result.Success(transportRequest.Id);
    }
}
