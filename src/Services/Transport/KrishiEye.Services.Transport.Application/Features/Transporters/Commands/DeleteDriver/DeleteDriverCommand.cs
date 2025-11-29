using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.DeleteDriver;

public record DeleteDriverCommand : IRequest<Result<bool>>
{
    public Guid DriverId { get; init; }
}

public class DeleteDriverCommandHandler : IRequestHandler<DeleteDriverCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFileStorageService _fileStorageService;

    public DeleteDriverCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IFileStorageService fileStorageService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _fileStorageService = fileStorageService;
    }

    public async Task<Result<bool>> Handle(DeleteDriverCommand request, CancellationToken cancellationToken)
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
            return Result.Failure<bool>("You do not have permission to delete this driver.");
        }

        // Check if driver is used in any job assignments
        var isUsedInJobs = await _context.JobAssignments
            .AnyAsync(j => j.DriverId == request.DriverId, cancellationToken);

        if (isUsedInJobs)
        {
            return Result.Failure<bool>("Cannot delete driver. Driver is assigned to one or more jobs.");
        }

        // Delete the license image if it exists
        if (!string.IsNullOrEmpty(driver.LicenseImageUrl))
        {
            await _fileStorageService.DeleteFileAsync(driver.LicenseImageUrl);
        }

        // Delete the driver
        _context.Drivers.Remove(driver);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(true);
    }
}
