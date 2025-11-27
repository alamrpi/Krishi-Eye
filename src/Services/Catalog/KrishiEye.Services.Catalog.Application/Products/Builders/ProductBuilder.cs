using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;

namespace KrishiEye.Services.Catalog.Application.Products.Builders;

/// <summary>
/// Fluent builder for creating Product entities with sensible defaults.
/// </summary>
public class ProductBuilder
{
    private string _name = string.Empty;
    private string _description = string.Empty;
    private Money _price = Money.Create(0, "BDT");
    private Guid _categoryId;
    private Guid _productTypeId;
    private Guid _unitId;
    private int _stockQuantity = 0;
    private Guid _sellerId = Guid.Empty;
    private SeoMetadata? _seoMetadata;
    private string _imageUrl = string.Empty;

    public ProductBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public ProductBuilder WithDescription(string description)
    {
        _description = description;
        return this;
    }

    public ProductBuilder WithPrice(decimal amount, string currency = "BDT")
    {
        _price = Money.Create(amount, currency);
        return this;
    }

    public ProductBuilder WithCategory(Guid categoryId, Guid productTypeId)
    {
        _categoryId = categoryId;
        _productTypeId = productTypeId;
        return this;
    }

    public ProductBuilder WithStock(int quantity, Guid unitId)
    {
        _stockQuantity = quantity;
        _unitId = unitId;
        return this;
    }

    public ProductBuilder ForSeller(Guid sellerId)
    {
        _sellerId = sellerId;
        return this;
    }

    public ProductBuilder WithSeo(string urlSlug, string metaTitle, string metaDescription)
    {
        _seoMetadata = SeoMetadata.Create(urlSlug, metaTitle, metaDescription);
        return this;
    }

    public ProductBuilder WithImage(string imageUrl)
    {
        _imageUrl = imageUrl;
        return this;
    }

    /// <summary>
    /// Builds the Product with all specified values.
    /// </summary>
    public Product Build()
    {
        // Auto-generate SEO metadata if not provided
        if (_seoMetadata == null)
        {
            var slug = _name.ToLowerInvariant().Replace(" ", "-");
            _seoMetadata = SeoMetadata.Create(slug, _name, _description);
        }

        // Product.Create signature: name, description, price, stockQuantity, unitId, imageUrl, sellerId, productTypeId, categoryId, seoMetadata
        var product = Product.Create(
            _name,
            _description,
            _price,
            _stockQuantity,
            _unitId,
            _imageUrl,
            _sellerId,
            _productTypeId,
            _categoryId,
            _seoMetadata
        );

        return product;
    }

    /// <summary>
    /// Creates a default test product for unit testing.
    /// </summary>
    public static Product CreateTestProduct()
    {
        return new ProductBuilder()
            .WithName("Test Product")
            .WithDescription("Test Description")
            .WithPrice(100)
            .WithStock(10, Guid.NewGuid())
            .WithCategory(Guid.NewGuid(), Guid.NewGuid())
            .ForSeller(Guid.NewGuid())
            .WithImage("test-image.jpg")
            .Build();
    }
}
