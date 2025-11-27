using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;

namespace KrishiEye.Services.Transport.Application.Features.TransportRequests.Commands.CreateTransportRequest;

public record CreateTransportRequestCommand(
    Guid RequesterId,
    DateTime ScheduledTime,
    string PickupAddress,
    decimal PickupLat,
    decimal PickupLng,
    string PickupDivision,
    string PickupDistrict,
    string PickupThana,
    string PickupPostalCode,
    string DropAddress,
    decimal DropLat,
    decimal DropLng,
    string DropDivision,
    string DropDistrict,
    string DropThana,
    string DropPostalCode,
    string GoodsType,
    decimal WeightKg
) : ICommand<Result<Guid>>;
