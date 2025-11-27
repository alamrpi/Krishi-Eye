using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Bids.Queries.GetMyBids;

public record BidDto
{
    public Guid Id { get; init; }
    public Guid RequestId { get; init; }
    public decimal BidAmount { get; init; }
    public string Currency { get; init; } = "BDT";
    public DateTime BidTime { get; init; }
    public BidStatus Status { get; init; }
    public string? Note { get; init; }
    
    // Request info
    public string PickupAddress { get; init; } = string.Empty;
    public string DropAddress { get; init; } = string.Empty;
    public DateTime ScheduledTime { get; init; }
    public RequestStatus RequestStatus { get; init; }
}

public record GetMyBidsQuery : IRequest<Result<List<BidDto>>>;

public class GetMyBidsQueryHandler : IRequestHandler<GetMyBidsQuery, Result<List<BidDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyBidsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<BidDto>>> Handle(GetMyBidsQuery request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<List<BidDto>>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<List<BidDto>>("Transporter profile not found.");
        }

        var bids = await _context.TransportBids
            .Include(b => b.Request)
            .Where(b => b.TransporterId == transporter.Id)
            .OrderByDescending(b => b.BidTime)
            .Select(b => new BidDto
            {
                Id = b.Id,
                RequestId = b.RequestId,
                BidAmount = b.BidAmount.Amount,
                Currency = b.BidAmount.Currency,
                BidTime = b.BidTime,
                Status = b.Status,
                Note = b.Note,
                PickupAddress = b.Request.PickupAddress,
                DropAddress = b.Request.DropAddress,
                ScheduledTime = b.Request.ScheduledTime,
                RequestStatus = b.Request.Status
            })
            .ToListAsync(cancellationToken);

        return Result.Success(bids);
    }
}
