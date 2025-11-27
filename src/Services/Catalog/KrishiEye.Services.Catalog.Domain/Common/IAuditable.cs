namespace KrishiEye.Services.Catalog.Domain.Common;

/// <summary>
/// Interface for entities that require audit information.
/// </summary>
public interface IAuditable
{
    DateTime CreatedAt { get; }
    DateTime? UpdatedAt { get; }
    string? CreatedBy { get; }
    string? UpdatedBy { get; }
}
