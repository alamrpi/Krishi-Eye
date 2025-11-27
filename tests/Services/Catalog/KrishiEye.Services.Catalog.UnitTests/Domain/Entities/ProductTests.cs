using FluentAssertions;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using Xunit;

namespace KrishiEye.Services.Catalog.UnitTests.Domain.Entities;

public class ProductTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateProduct()
    {
        // Arrange
        var name = "Organic Tomato";
        var description = "Fresh organic tomatoes";
        var price = Money.Create(50, "BDT");
        var stock = 100;
        var unitId = Guid.NewGuid();
        var imageUrl = "tomato.jpg";
        var sellerId = Guid.NewGuid();
        var productTypeId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var seoMetadata = SeoMetadata.Create("organic-tomato", "Organic Tomato", "Fresh tomatoes");

        // Act
        var product = Product.Create(
            name, description, price, stock, unitId,
            imageUrl, sellerId, productTypeId, categoryId, seoMetadata);

        // Assert
        product.Should().NotBeNull();
        product.Name.Should().Be(name);
        product.Description.Should().Be(description);
        product.Price.Should().Be(price);
        product.StockQuantity.Should().Be(stock);
        product.SellerId.Should().Be(sellerId);
        product.IsInStock().Should().BeTrue();
    }

    [Fact]
    public void Create_WithEmptyName_ShouldThrowException()
    {
        // Arrange & Act
        var action = () => Product.Create(
            "", "Description", Money.Create(50, "BDT"), 100,
            Guid.NewGuid(), "image.jpg", Guid.NewGuid(),
            Guid.NewGuid(), Guid.NewGuid(),
            SeoMetadata.Create("slug", "Title", "Desc"));

        // Assert
        action.Should().Throw<ArgumentException>()
            .WithMessage("*name*");
    }

    [Fact]
    public void Create_WithNegativeStock_ShouldThrowException()
    {
        // Arrange & Act
        var action = () => Product.Create(
            "Product", "Description", Money.Create(50, "BDT"), -10,
            Guid.NewGuid(), "image.jpg", Guid.NewGuid(),
            Guid.NewGuid(), Guid.NewGuid(),
            SeoMetadata.Create("slug", "Title", "Desc"));

        // Assert
        action.Should().Throw<ArgumentException>()
            .WithMessage("*Stock quantity*");
    }

    [Fact]
    public void UpdatePrice_WithValidPrice_ShouldUpdateSuccessfully()
    {
        // Arrange
        var product = CreateTestProduct();
        var newPrice = Money.Create(75, "BDT");

        // Act
        product.UpdatePrice(newPrice);

        // Assert
        product.Price.Should().Be(newPrice);
    }

    [Fact]
    public void UpdatePrice_WithDifferentCurrency_ShouldThrowException()
    {
        // Arrange
        var product = CreateTestProduct();
        var newPrice = Money.Create(75, "USD");

        // Act
        var action = () => product.UpdatePrice(newPrice);

        // Assert
        action.Should().Throw<InvalidOperationException>()
            .WithMessage("*currency*");
    }

    [Fact]
    public void AddStock_WithPositiveQuantity_ShouldIncreaseStock()
    {
        // Arrange
        var product = CreateTestProduct();
        var initialStock = product.StockQuantity;

        // Act
        product.AddStock(50);

        // Assert
        product.StockQuantity.Should().Be(initialStock + 50);
    }

    [Fact]
    public void AddStock_WithNegativeQuantity_ShouldThrowException()
    {
        // Arrange
        var product = CreateTestProduct();

        // Act
        var action = () => product.AddStock(-10);

        // Assert
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void RemoveStock_WithValidQuantity_ShouldDecreaseStock()
    {
        // Arrange
        var product = CreateTestProduct();
        var initialStock = product.StockQuantity;

        // Act
        product.RemoveStock(30);

        // Assert
        product.StockQuantity.Should().Be(initialStock - 30);
    }

    [Fact]
    public void RemoveStock_WithInsufficientStock_ShouldThrowException()
    {
        // Arrange
        var product = CreateTestProduct();

        // Act
        var action = () => product.RemoveStock(product.StockQuantity + 1);

        // Assert
        action.Should().Throw<InvalidOperationException>()
            .WithMessage("*Insufficient stock*");
    }

    [Fact]
    public void IsInStock_WithPositiveStock_ShouldReturnTrue()
    {
        // Arrange
        var product = CreateTestProduct();

        // Act & Assert
        product.IsInStock().Should().BeTrue();
    }

    [Fact]
    public void IsOutOfStock_WithZeroStock_ShouldReturnTrue()
    {
        // Arrange
        var product = CreateTestProduct();
        product.RemoveStock(product.StockQuantity);

        // Act & Assert
        product.IsOutOfStock().Should().BeTrue();
    }

    private Product CreateTestProduct()
    {
        return Product.Create(
            "Test Product",
            "Test Description",
            Money.Create(50, "BDT"),
            100,
            Guid.NewGuid(),
            "test.jpg",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            SeoMetadata.Create("test-product", "Test Product", "Description"));
    }
}
