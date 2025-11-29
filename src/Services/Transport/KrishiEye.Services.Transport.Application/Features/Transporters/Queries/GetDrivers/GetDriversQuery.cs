using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetDrivers;

public record GetDriversQuery : IRequest<Result<List<DriverDto>>>
{
}

public class DriverDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string NidNumber { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public string LicenseImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class GetDriversQueryHandler : IRequestHandler<GetDriversQuery, Result<List<DriverDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetDriversQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<DriverDto>>> Handle(GetDriversQuery request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<List<DriverDto>>("User is not authenticated.");
        }

        // Find transporter profile
        var transporter = await _context.TransporterProfiles
            .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

        if (transporter == null)
        {
            return Result.Failure<List<DriverDto>>("Transporter profile not found.");
        }

        // Get all drivers for this transporter
        var drivers = await _context.Drivers
            .Where(d => d.TransporterId == transporter.Id)
            .Select(d => new DriverDto
            {
                Id = d.Id,
                FullName = d.FullName,
                Phone = d.Phone,
                NidNumber = d.NidNumber,
                LicenseNumber = d.LicenseNumber,
                LicenseExpiryDate = d.LicenseExpiryDate,
                LicenseImageUrl = d.LicenseImageUrl,
                IsActive = true // You can add logic for active status
            })
            .ToListAsync(cancellationToken);

        return Result.Success(drivers);
    }
}
