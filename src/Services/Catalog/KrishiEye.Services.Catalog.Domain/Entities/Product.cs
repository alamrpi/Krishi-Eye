using KrishiEye.Services.Catalog.Domain.Common;
using KrishiEye.Services.Catalog.Domain.ValueObjects;

namespace KrishiEye.Services.Catalog.Domain.Entities;

/// <summary>
/// Represents a product in the catalog with rich domain logic.
/// </summary>
public sealed class Product : BaseEntity, ISeoEnabled
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Money Price { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid UnitId { get; private set; }
    public string ImageUrl { get; private set; }
    public Guid SellerId { get; private set; }
    public Guid ProductTypeId { get; private set; }
    public Guid CategoryId { get; private set; }
    public SeoMetadata SeoMetadata { get; private set; }

    // Navigation properties
    public ProductType ProductType { get; private set; } = null!;
    public Category Category { get; private set; } = null!;
    public MeasurementUnit Unit { get; private set; } = null!;

    private Product() : base() { } // EF Core

    private Product(
        string name,
        string description,
        Money price,
        int stockQuantity,
        Guid unitId,
        string imageUrl,
        Guid sellerId,
        Guid productTypeId,
        Guid categoryId,
        SeoMetadata seoMetadata) : base()
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be empty", nameof(name));

        if (stockQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(stockQuantity));

        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        UnitId = unitId;
        ImageUrl = imageUrl;
        SellerId = sellerId;
        ProductTypeId = productTypeId;
        CategoryId = categoryId;
        SeoMetadata = seoMetadata;
    }

    public static Product Create(
        string name,
        string description,
        Money price,
        int stockQuantity,
        Guid unitId,
        string imageUrl,
        Guid sellerId,
        Guid productTypeId,
        Guid categoryId,
        SeoMetadata seoMetadata)
    {
        return new Product(name, description, price, stockQuantity, unitId, imageUrl, sellerId, productTypeId, categoryId, seoMetadata);
    }

    // Business logic methods
    public void UpdatePrice(Money newPrice)
    {
        if (newPrice.Amount <= 0)
            throw new ArgumentException("Price must be greater than zero");

        if (newPrice.Currency != Price.Currency)
            throw new InvalidOperationException($"Cannot change currency from {Price.Currency} to {newPrice.Currency}");

        Price = newPrice;
        MarkAsUpdated();
    }

    public void AddStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        StockQuantity += quantity;
        MarkAsUpdated();
    }

    public void RemoveStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (StockQuantity < quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {StockQuantity}, Requested: {quantity}");

        StockQuantity -= quantity;
        MarkAsUpdated();
    }

    public bool IsInStock() => StockQuantity > 0;
    public bool IsOutOfStock() => StockQuantity == 0;
}
