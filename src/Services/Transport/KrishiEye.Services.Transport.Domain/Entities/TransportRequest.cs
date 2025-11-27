using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using KrishiEye.Services.Transport.Domain.ValueObjects;
using KrishiEye.Services.Transport.Domain.Events;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Aggregate root for transport request workflow
/// Represents a farmer/trader's request for transportation
/// </summary>
public class TransportRequest : BaseEntity
{
    public Guid RequesterId { get; private set; }
    public DateTime ScheduledTime { get; private set; }
    
    // Pickup information
    public string PickupAddress { get; private set; } = string.Empty;
    public Location PickupLocation { get; private set; } = null!;
    
    // Drop information
    public string DropAddress { get; private set; } = string.Empty;
    public Location DropLocation { get; private set; } = null!;
    
    // Goods information
    public string GoodsType { get; private set; } = string.Empty;
    public decimal WeightKg { get; private set; }
    
    // Status and result
    public RequestStatus Status { get; private set; }
    public Guid? WinnerBidId { get; private set; }
    
    // Navigation properties
    public ICollection<TransportBid> Bids { get; private set; } = new List<TransportBid>();
    public JobAssignment? JobAssignment { get; private set; }

    private TransportRequest() { } // EF Core constructor

    private TransportRequest(
        Guid requesterId,
        DateTime scheduledTime,
        string pickupAddress,
        Location pickupLocation,
        string dropAddress,
        Location dropLocation,
        string goodsType,
        decimal weightKg)
    {
        Id = Guid.NewGuid();
        RequesterId = requesterId;
        ScheduledTime = scheduledTime;
        PickupAddress = pickupAddress;
        PickupLocation = pickupLocation;
        DropAddress = dropAddress;
        DropLocation = dropLocation;
        GoodsType = goodsType;
        WeightKg = weightKg;
        Status = RequestStatus.Open;
        
        // Domain event: Request created
        AddDomainEvent(new TransportRequestCreatedEvent(Id, pickupLocation));
    }

    /// <summary>
    /// Factory method to create a new transport request (Factory Pattern)
    /// </summary>
    public static TransportRequest Create(
        Guid requesterId,
        DateTime scheduledTime,
        string pickupAddress,
        decimal pickupLat,
        decimal pickupLng,
        string pickupDivision,
        string pickupDistrict,
        string pickupThana,
        string pickupPostalCode,
        string dropAddress,
        decimal dropLat,
        decimal dropLng,
        string dropDivision,
        string dropDistrict,
        string dropThana,
        string dropPostalCode,
        string goodsType,
        decimal weightKg)
    {
        // Guard clauses (Fail Fast Principle)
        if (requesterId == Guid.Empty)
            throw new ArgumentException("Requester ID cannot be empty", nameof(requesterId));
        
        if (scheduledTime <= DateTime.UtcNow)
            throw new ArgumentException("Scheduled time must be in the future", nameof(scheduledTime));
        
        if (string.IsNullOrWhiteSpace(pickupAddress))
            throw new ArgumentException("Pickup address cannot be empty", nameof(pickupAddress));
        
        if (string.IsNullOrWhiteSpace(dropAddress))
            throw new ArgumentException("Drop address cannot be empty", nameof(dropAddress));
        
        if (weightKg <= 0)
            throw new ArgumentException("Weight must be positive", nameof(weightKg));

        var pickupLocation = Location.Create(
            pickupLat, pickupLng,
            pickupDivision, pickupDistrict, pickupThana, pickupPostalCode, pickupAddress);
        
        var dropLocation = Location.Create(
            dropLat, dropLng,
            dropDivision, dropDistrict, dropThana, dropPostalCode, dropAddress);

        return new TransportRequest(
            requesterId,
            scheduledTime,
            pickupAddress,
            pickupLocation,
            dropAddress,
            dropLocation,
            goodsType,
            weightKg);
    }

    /// <summary>
    /// Move status to Bidding (State Pattern)
    /// </summary>
    public void StartBidding()
    {
        if (Status != RequestStatus.Open)
            throw new InvalidOperationException($"Cannot start bidding from {Status} status");

        Status = RequestStatus.Bidding;
        UpdateTimestamp();
    }

    /// <summary>
    /// Accept a specific bid (Business Rule: Only one bid can be accepted)
    /// </summary>
    public void AcceptBid(Guid bidId)
    {
        if (Status != RequestStatus.Bidding && Status != RequestStatus.Open)
            throw new InvalidOperationException($"Cannot accept bid when status is {Status}");

        var bid = Bids.FirstOrDefault(b => b.Id == bidId);
        if (bid == null)
            throw new InvalidOperationException("Bid not found");

        WinnerBidId = bidId;
        Status = RequestStatus.Confirmed;
        bid.Accept();
        
        // Reject all other bids
        foreach (var otherBid in Bids.Where(b => b.Id != bidId && b.Status == BidStatus.Pending))
        {
            otherBid.Reject();
        }

        UpdateTimestamp();
        AddDomainEvent(new BidAcceptedEvent(Id, bidId, bid.TransporterId));
    }

    /// <summary>
    /// Start transit (vehicle picked up goods)
    /// </summary>
    public void StartTransit()
    {
        if (Status != RequestStatus.Confirmed)
            throw new InvalidOperationException("Request must be confirmed before starting transit");

        Status = RequestStatus.InTransit;
        UpdateTimestamp();
    }

    /// <summary>
    /// Complete the request (goods delivered)
    /// </summary>
    public void Complete()
    {
        if (Status != RequestStatus.InTransit)
            throw new InvalidOperationException("Request must be in transit to complete");

        Status = RequestStatus.Completed;
        UpdateTimestamp();
        AddDomainEvent(new TransportRequestCompletedEvent(Id));
    }

    /// <summary>
    /// Cancel the request
    /// </summary>
    public void Cancel()
    {
        if (Status == RequestStatus.Completed)
            throw new InvalidOperationException("Cannot cancel completed request");

        if (Status == RequestStatus.InTransit)
            throw new InvalidOperationException("Cannot cancel request in transit");

        Status = RequestStatus.Cancelled;
        UpdateTimestamp();
    }

    /// <summary>
    /// Calculate estimated distance for the trip
    /// </summary>
    public double GetEstimatedDistanceKm()
    {
        return PickupLocation.CalculateDistanceKm(DropLocation);
    }

    /// <summary>
    /// Check if request is within transporter's service radius
    /// </summary>
    public bool IsWithinRadiusOf(Location transporterLocation, int radiusKm)
    {
        return PickupLocation.IsWithinRadiusOf(transporterLocation, radiusKm);
    }
}
