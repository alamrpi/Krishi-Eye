using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.Enums;
using KrishiEye.Services.Transport.Domain.ValueObjects;
using MediatR;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.CreateTransporterProfile;

public record CreateTransporterProfileCommand : IRequest<Result<Guid>>
{
    public string Name { get; init; } = string.Empty;
    public string ContactNumber { get; init; } = string.Empty;
    public TransporterType Type { get; init; }
    public string TradeLicenseNumber { get; init; } = string.Empty;
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string AddressLine { get; init; } = string.Empty;
    public string Division { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public string Thana { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
}

public class CreateTransporterProfileCommandHandler : IRequestHandler<CreateTransporterProfileCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateTransporterProfileCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<Guid>> Handle(CreateTransporterProfileCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Result.Failure<Guid>("User is not authenticated.");
        }

        // Check if profile already exists
        // Note: In a real scenario, we might want to check this. 
        // For now, assuming the controller/UI handles the "already exists" check or we let DB unique constraint fail.
        // But let's add a check for safety if possible, or rely on EF Core exception handling.
        
        var location = Location.Create(
            (decimal)request.Latitude, 
            (decimal)request.Longitude, 
            request.AddressLine, 
            request.Division, 
            request.District, 
            request.Thana, 
            request.PostalCode);

        var entity = new TransporterProfile(
            userId,
            request.Name,
            request.ContactNumber,
            request.Type,
            request.TradeLicenseNumber,
            location);

        _context.TransporterProfiles.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(entity.Id);
    }
}
