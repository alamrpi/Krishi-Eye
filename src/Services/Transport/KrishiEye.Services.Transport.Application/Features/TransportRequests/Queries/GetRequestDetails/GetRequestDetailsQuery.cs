using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.TransportRequests.Queries.GetRequestDetails;

public record RequestBidDto
{
    public Guid Id { get; init; }
    public Guid TransporterId { get; init; }
    public string TransporterName { get; init; } = string.Empty;
    public decimal BidAmount { get; init; }
    public DateTime BidTime { get; init; }
    public BidStatus Status { get; init; }
    public string? Note { get; init; }
    public decimal TransporterRating { get; init; }
    public int TransporterTotalJobs { get; init; }
}

public record RequestDetailsDto
{
    public Guid Id { get; init; }
    public Guid RequesterId { get; init; }
    public DateTime ScheduledTime { get; init; }
    public string PickupAddress { get; init; } = string.Empty;
    public decimal PickupLatitude { get; init; }
    public decimal PickupLongitude { get; init; }
    public string DropAddress { get; init; } = string.Empty;
    public decimal DropLatitude { get; init; }
    public decimal DropLongitude { get; init; }
    public string GoodsType { get; init; } = string.Empty;
    public decimal WeightKg { get; init; }
    public RequestStatus Status { get; init; }
    public Guid? WinnerBidId { get; init; }
    public List<RequestBidDto> Bids { get; init; } = new();
}

public record GetRequestDetailsQuery : IRequest<Result<RequestDetailsDto>>
{
    public Guid RequestId { get; init; }
}

public class GetRequestDetailsQueryHandler : IRequestHandler<GetRequestDetailsQuery, Result<RequestDetailsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRequestDetailsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<RequestDetailsDto>> Handle(GetRequestDetailsQuery request, CancellationToken cancellationToken)
    {
        var transportRequest = await _context.TransportRequests
            .Include(r => r.Bids)
                .ThenInclude(b => b.Transporter)
            .FirstOrDefaultAsync(r => r.Id == request.RequestId, cancellationToken);

        if (transportRequest == null)
        {
            return Result.Failure<RequestDetailsDto>("Transport request not found.");
        }

        var dto = new RequestDetailsDto
        {
            Id = transportRequest.Id,
            RequesterId = transportRequest.RequesterId,
            ScheduledTime = transportRequest.ScheduledTime,
            PickupAddress = transportRequest.PickupAddress,
            PickupLatitude = transportRequest.PickupLocation.Latitude,
            PickupLongitude = transportRequest.PickupLocation.Longitude,
            DropAddress = transportRequest.DropAddress,
            DropLatitude = transportRequest.DropLocation.Latitude,
            DropLongitude = transportRequest.DropLocation.Longitude,
            GoodsType = transportRequest.GoodsType,
            WeightKg = transportRequest.WeightKg,
            Status = transportRequest.Status,
            WinnerBidId = transportRequest.WinnerBidId,
            Bids = transportRequest.Bids.Select(b => new RequestBidDto
            {
                Id = b.Id,
                TransporterId = b.TransporterId,
                TransporterName = b.Transporter.Name,
                BidAmount = b.BidAmount.Amount,
                BidTime = b.BidTime,
                Status = b.Status,
                Note = b.Note,
                TransporterRating = b.Transporter.Rating,
                TransporterTotalJobs = b.Transporter.TotalJobs
            }).OrderBy(b => b.BidAmount).ToList()
        };

        return Result.Success(dto);
    }
}
