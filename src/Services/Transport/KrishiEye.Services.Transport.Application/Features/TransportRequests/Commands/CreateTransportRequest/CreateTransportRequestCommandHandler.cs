using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using MediatR;

namespace KrishiEye.Services.Transport.Application.Features.TransportRequests.Commands.CreateTransportRequest;

public class CreateTransportRequestCommandHandler : IRequestHandler<CreateTransportRequestCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public CreateTransportRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(CreateTransportRequestCommand request, CancellationToken cancellationToken)
    {
        // Create the entity using the factory method
        // Note: The factory method handles domain validation (Guard Clauses)
        // while FluentValidation handles input validation (Validator)
        
        try 
        {
            var entity = TransportRequest.Create(
                request.RequesterId,
                request.ScheduledTime,
                request.PickupAddress,
                request.PickupLat,
                request.PickupLng,
                request.PickupDivision,
                request.PickupDistrict,
                request.PickupThana,
                request.PickupPostalCode,
                request.DropAddress,
                request.DropLat,
                request.DropLng,
                request.DropDivision,
                request.DropDistrict,
                request.DropThana,
                request.DropPostalCode,
                request.GoodsType,
                request.WeightKg
            );

            _context.TransportRequests.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success(entity.Id);
        }
        catch (Exception ex)
        {
            // In a real scenario, we might want to log this or map specific exceptions to Result.Failure
            // For now, let global exception handler catch unexpected errors, 
            // or return Failure if it's a known domain rule violation that wasn't caught by validator
            return Result.Failure<Guid>(ex.Message);
        }
    }
}
