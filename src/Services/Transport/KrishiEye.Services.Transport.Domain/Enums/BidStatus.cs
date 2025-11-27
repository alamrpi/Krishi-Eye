namespace KrishiEye.Services.Transport.Domain.Enums;

/// <summary>
/// Defines the status of a bid submitted by a transporter
/// </summary>
public enum BidStatus
{
    /// <summary>
    /// Bid has been submitted and is awaiting requester decision
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Bid has been accepted by the requester
    /// </summary>
    Accepted = 2,

    /// <summary>
    /// Bid has been rejected by the requester
    /// </summary>
    Rejected = 3,

    /// <summary>
    /// Bid was withdrawn by the transporter
    /// </summary>
    Withdrawn = 4
}
