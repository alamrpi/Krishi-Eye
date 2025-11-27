using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetNearbyRequests;

public record TransportRequestDto
{
    public Guid Id { get; init; }
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
    public double DistanceKm { get; init; }
    public int BidCount { get; init; }
}

public record GetNearbyRequestsQuery : IRequest<Result<List<TransportRequestDto>>>
{
    public int RadiusKm { get; init; } = 50; // Default 50km radius
}

public class GetNearbyRequestsQueryHandler : IRequestHandler<GetNearbyRequestsQuery, Result<List<TransportRequestDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetNearbyRequestsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<TransportRequestDto>>> Handle(GetNearbyRequestsQuery request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<List<TransportRequestDto>>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<List<TransportRequestDto>>("Transporter profile not found.");
        }

        var transporterLat = transporter.Location.Latitude;
        var transporterLng = transporter.Location.Longitude;
        var radiusKm = request.RadiusKm > 0 ? request.RadiusKm : transporter.ServiceRadiusKm;

        // Get all open/bidding requests and calculate distance using Haversine formula
        var requests = await _context.TransportRequests
            .Include(r => r.Bids)
            .Where(r => r.Status == RequestStatus.Open || r.Status == RequestStatus.Bidding)
            .Select(r => new
            {
                Request = r,
                Distance = CalculateDistance(
                    (double)transporterLat, 
                    (double)transporterLng, 
                    (double)r.PickupLocation.Latitude, 
                    (double)r.PickupLocation.Longitude)
            })
            .Where(x => x.Distance <= radiusKm)
            .OrderBy(x => x.Distance)
            .ToListAsync(cancellationToken);

        var result = requests.Select(x => new TransportRequestDto
        {
            Id = x.Request.Id,
            ScheduledTime = x.Request.ScheduledTime,
            PickupAddress = x.Request.PickupAddress,
            PickupLatitude = x.Request.PickupLocation.Latitude,
            PickupLongitude = x.Request.PickupLocation.Longitude,
            DropAddress = x.Request.DropAddress,
            DropLatitude = x.Request.DropLocation.Latitude,
            DropLongitude = x.Request.DropLocation.Longitude,
            GoodsType = x.Request.GoodsType,
            WeightKg = x.Request.WeightKg,
            Status = x.Request.Status,
            DistanceKm = x.Distance,
            BidCount = x.Request.Bids.Count
        }).ToList();

        return Result.Success(result);
    }

    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double earthRadiusKm = 6371.0;

        var dLat = DegreesToRadians(lat2 - lat1);
        var dLon = DegreesToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return earthRadiusKm * c;
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }
}
