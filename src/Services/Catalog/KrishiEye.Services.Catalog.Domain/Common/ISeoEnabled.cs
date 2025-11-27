using KrishiEye.Services.Catalog.Domain.ValueObjects;

namespace KrishiEye.Services.Catalog.Domain.Common;

/// <summary>
/// Interface for entities that support SEO metadata.
/// </summary>
public interface ISeoEnabled
{
    SeoMetadata SeoMetadata { get; }
}
