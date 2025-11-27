using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetEarningsReport;

public record CompletedJobDto
{
    public Guid RequestId { get; init; }
    public DateTime CompletedAt { get; init; }
    public string PickupAddress { get; init; } = string.Empty;
    public string DropAddress { get; init; } = string.Empty;
    public decimal BidAmount { get; init; }
    public PaymentMethod PaymentMethod { get; init; }
    public bool IsCashReceived { get; init; }
}

public record EarningsReportDto
{
    public int TotalJobsCompleted { get; init; }
    public decimal TotalEarnings { get; init; }
    public decimal CashEarnings { get; init; }
    public decimal OnlineEarnings { get; init; }
    public decimal CashReceived { get; init; }
    public decimal CashPending { get; init; }
    public List<CompletedJobDto> CompletedJobs { get; init; } = new();
}

public record GetEarningsReportQuery : IRequest<Result<EarningsReportDto>>;

public class GetEarningsReportQueryHandler : IRequestHandler<GetEarningsReportQuery, Result<EarningsReportDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetEarningsReportQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<EarningsReportDto>> Handle(GetEarningsReportQuery request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<EarningsReportDto>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<EarningsReportDto>("Transporter profile not found.");
        }

        // Get all completed jobs for this transporter
        var completedJobs = await _context.TransportRequests
            .Include(r => r.Bids)
            .Where(r => r.Status == RequestStatus.Completed && 
                        r.Bids.Any(b => b.TransporterId == transporter.Id && b.Status == BidStatus.Accepted))
            .Select(r => new
            {
                Request = r,
                WinningBid = r.Bids.First(b => b.TransporterId == transporter.Id && b.Status == BidStatus.Accepted)
            })
            .ToListAsync(cancellationToken);

        var jobDtos = completedJobs.Select(j => new CompletedJobDto
        {
            RequestId = j.Request.Id,
            CompletedAt = j.Request.UpdatedAt,
            PickupAddress = j.Request.PickupAddress,
            DropAddress = j.Request.DropAddress,
            BidAmount = j.WinningBid.BidAmount.Amount,
            PaymentMethod = j.Request.PaymentMethod,
            IsCashReceived = j.Request.IsCashReceived
        }).OrderByDescending(j => j.CompletedAt).ToList();

        var totalEarnings = jobDtos.Sum(j => j.BidAmount);
        var cashJobs = jobDtos.Where(j => j.PaymentMethod == PaymentMethod.Cash).ToList();
        var onlineJobs = jobDtos.Where(j => j.PaymentMethod == PaymentMethod.Online).ToList();

        var report = new EarningsReportDto
        {
            TotalJobsCompleted = jobDtos.Count,
            TotalEarnings = totalEarnings,
            CashEarnings = cashJobs.Sum(j => j.BidAmount),
            OnlineEarnings = onlineJobs.Sum(j => j.BidAmount),
            CashReceived = cashJobs.Where(j => j.IsCashReceived).Sum(j => j.BidAmount),
            CashPending = cashJobs.Where(j => !j.IsCashReceived).Sum(j => j.BidAmount),
            CompletedJobs = jobDtos
        };

        return Result.Success(report);
    }
}
