using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.ValueObjects;

namespace KrishiEye.Services.Transport.Domain.Events;

public record TransportRequestCreatedEvent(Guid RequestId, Location PickupLocation) : IDomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

public record BidAcceptedEvent(Guid RequestId, Guid BidId, Guid TransporterId) : IDomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

public record TransportRequestCompletedEvent(Guid RequestId) : IDomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
