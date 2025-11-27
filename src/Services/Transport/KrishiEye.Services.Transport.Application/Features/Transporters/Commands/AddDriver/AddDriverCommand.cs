using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddDriver;

public record AddDriverCommand : IRequest<Result<Guid>>
{
    public string FullName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string NidNumber { get; init; } = string.Empty;
    public string LicenseNumber { get; init; } = string.Empty;
    public DateTime LicenseExpiryDate { get; init; }
    public string LicenseImageUrl { get; init; } = string.Empty;
}

public class AddDriverCommandHandler : IRequestHandler<AddDriverCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddDriverCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<Guid>> Handle(AddDriverCommand request, CancellationToken cancellationToken)
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

        var driver = new Driver
        {
            Id = Guid.NewGuid(),
            TransporterId = transporter.Id,
            FullName = request.FullName,
            Phone = request.Phone,
            NidNumber = request.NidNumber,
            LicenseNumber = request.LicenseNumber,
            LicenseExpiryDate = request.LicenseExpiryDate,
            LicenseImageUrl = request.LicenseImageUrl
        };

        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(driver.Id);
    }
}
