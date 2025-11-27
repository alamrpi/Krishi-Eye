using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Enums;
using KrishiEye.Services.Transport.Domain.ValueObjects;

namespace KrishiEye.Services.Transport.Domain.Entities;

/// <summary>
/// Represents a bid submitted by a transporter for a transport request
/// </summary>
public class TransportBid : BaseEntity
{
    public Guid RequestId { get; private set; }
    public Guid TransporterId { get; private set; }
    public Money BidAmount { get; private set; } = null!;
    public DateTime BidTime { get; private set; }
    public string? Note { get; private set; }
    public BidStatus Status { get; private set; }
    
    // Navigation properties
    public TransportRequest Request { get; private set; } = null!;
    public TransporterProfile Transporter { get; private set; } = null!;

    private TransportBid() { } // EF Core constructor

    private TransportBid(
        Guid requestId,
        Guid transporterId,
        Money bidAmount,
        string? note)
    {
        Id = Guid.NewGuid();
        RequestId = requestId;
        TransporterId = transporterId;
        BidAmount = bidAmount;
        BidTime = DateTime.UtcNow;
        Note = note;
        Status = BidStatus.Pending;
    }

    /// <summary>
    /// Factory method to create a new bid
    /// </summary>
    public static TransportBid Create(
        Guid requestId,
        Guid transporterId,
        decimal bidAmount,
        string? note = null)
    {
        // Guard clauses
        if (requestId == Guid.Empty)
            throw new ArgumentException("Request ID cannot be empty", nameof(requestId));
        
        if (transporterId == Guid.Empty)
            throw new ArgumentException("Transporter ID cannot be empty", nameof(transporterId));
        
        if (bidAmount <= 0)
            throw new ArgumentException("Bid amount must be positive", nameof(bidAmount));

        var money = Money.Bdt(bidAmount);
        
        return new TransportBid(requestId, transporterId, money, note);
    }

    /// <summary>
    /// Accept this bid (called from TransportRequest aggregate)
    /// </summary>
    public void Accept()
    {
        if (Status != BidStatus.Pending)
            throw new InvalidOperationException($"Cannot accept bid with status {Status}");

        Status = BidStatus.Accepted;
        UpdateTimestamp();
    }

    /// <summary>
    /// Reject this bid (called from TransportRequest aggregate)
    /// </summary>
    public void Reject()
    {
        if (Status != BidStatus.Pending)
            throw new InvalidOperationException($"Cannot reject bid with status {Status}");

        Status = BidStatus.Rejected;
        UpdateTimestamp();
    }

    /// <summary>
    /// Withdraw this bid (by transporter)
    /// </summary>
    public void Withdraw()
    {
        if (Status != BidStatus.Pending)
            throw new InvalidOperationException("Only pending bids can be withdrawn");

        Status = BidStatus.Withdrawn;
        UpdateTimestamp();
    }

    /// <summary>
    /// Check if bid is still active
    /// </summary>
    public bool IsActive()
    {
        return Status == BidStatus.Pending;
    }
}
