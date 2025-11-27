using KrishiEye.Services.Catalog.Domain.Common;
using KrishiEye.Services.Catalog.Domain.ValueObjects;

namespace KrishiEye.Services.Catalog.Domain.Entities;

/// <summary>
/// Represents a product type (e.g., Crop, Farming Tool, Livestock).
/// </summary>
public sealed class ProductType : BaseEntity, ISeoEnabled
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public SeoMetadata SeoMetadata { get; private set; }

    private ProductType() : base() { } // EF Core

    private ProductType(string name, string description, SeoMetadata seoMetadata) : base()
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product type name cannot be empty", nameof(name));

        Name = name;
        Description = description;
        SeoMetadata = seoMetadata;
    }

    public static ProductType Create(string name, string description, SeoMetadata seoMetadata)
    {
        return new ProductType(name, description, seoMetadata);
    }
}
