using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.UpdateDriver;

public record UpdateDriverCommand : IRequest<Result<bool>>
{
    public Guid DriverId { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string NidNumber { get; init; } = string.Empty;
    public string LicenseNumber { get; init; } = string.Empty;
    public DateTime LicenseExpiryDate { get; init; }
    public string LicenseImageUrl { get; init; } = string.Empty;
}

public class UpdateDriverCommandHandler : IRequestHandler<UpdateDriverCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateDriverCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(UpdateDriverCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<bool>("User is not authenticated.");
        }

        // Find the driver
        var driver = await _context.Drivers
            .Include(d => d.Transporter)
            .FirstOrDefaultAsync(d => d.Id == request.DriverId, cancellationToken);

        if (driver == null)
        {
            return Result.Failure<bool>("Driver not found.");
        }

        // Check if driver belongs to current user's transporter
        if (driver.Transporter.UserId != userId)
        {
            return Result.Failure<bool>("You do not have permission to update this driver.");
        }

        // Update driver fields
        driver.FullName = request.FullName;
        driver.Phone = request.Phone;
        driver.NidNumber = request.NidNumber;
        driver.LicenseNumber = request.LicenseNumber;
        driver.LicenseExpiryDate = request.LicenseExpiryDate;
        driver.LicenseImageUrl = request.LicenseImageUrl;

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(true);
    }
}
