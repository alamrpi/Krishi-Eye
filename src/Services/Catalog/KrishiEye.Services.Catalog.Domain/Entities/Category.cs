using KrishiEye.Services.Catalog.Domain.Common;
using KrishiEye.Services.Catalog.Domain.ValueObjects;

namespace KrishiEye.Services.Catalog.Domain.Entities;

/// <summary>
/// Represents a product category with hierarchical support (parent-child for subcategories).
/// </summary>
public sealed class Category : BaseEntity, ISeoEnabled
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Guid ProductTypeId { get; private set; }
    public Guid? ParentCategoryId { get; private set; }
    public SeoMetadata SeoMetadata { get; private set; }

    // Navigation properties
    public ProductType ProductType { get; private set; } = null!;
    public Category? ParentCategory { get; private set; }

    private Category() : base() { } // EF Core

    private Category(
        string name,
        string description,
        Guid productTypeId,
        SeoMetadata seoMetadata,
        Guid? parentCategoryId = null) : base()
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty", nameof(name));

        Name = name;
        Description = description;
        ProductTypeId = productTypeId;
        ParentCategoryId = parentCategoryId;
        SeoMetadata = seoMetadata;
    }

    public static Category Create(
        string name,
        string description,
        Guid productTypeId,
        SeoMetadata seoMetadata,
        Guid? parentCategoryId = null)
    {
        return new Category(name, description, productTypeId, seoMetadata, parentCategoryId);
    }

    public bool IsRootCategory() => !ParentCategoryId.HasValue;
    public bool IsSubCategory() => ParentCategoryId.HasValue;
}
