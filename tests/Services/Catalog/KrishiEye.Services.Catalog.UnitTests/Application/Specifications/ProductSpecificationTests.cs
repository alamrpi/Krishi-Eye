using FluentAssertions;
using KrishiEye.Services.Catalog.Application.Products.Specifications;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using Xunit;

namespace KrishiEye.Services.Catalog.UnitTests.Application.Specifications;

public class ProductSpecificationTests
{
    [Fact]
    public void ProductBySlugSpecification_ShouldFilterBySlug()
    {
        // Arrange
        var slug = "organic-tomato";
        var spec = new ProductBySlugSpecification(slug);

        var product1 = CreateProduct("organic-tomato");
        var product2 = CreateProduct("fresh-potato");
        var products = new List<Product> { product1, product2 };

        // Act
        var result = products.AsQueryable().Where(spec.Criteria);

        // Assert
        result.Should().ContainSingle();
        result.First().SeoMetadata.UrlSlug.Should().Be(slug);
    }

    [Fact]
    public void ProductsByPriceRangeSpecification_ShouldFilterByPriceRange()
    {
        // Arrange
        var spec = new ProductsByPriceRangeSpecification(50, 100);

        var product1 = CreateProduct("product1", price: 30);
        var product2 = CreateProduct("product2", price: 75);
        var product3 = CreateProduct("product3", price: 120);
        var products = new List<Product> { product1, product2, product3 };

        // Act
        var result = products.AsQueryable().Where(spec.Criteria);

        // Assert
        result.Should().ContainSingle();
        result.First().Price.Amount.Should().Be(75);
    }

    [Fact]
    public void InStockProductsSpecification_ShouldFilterInStockOnly()
    {
        // Arrange
        var spec = new InStockProductsSpecification();

        var product1 = CreateProduct("product1", stock: 10);
        var product2 = CreateProduct("product2", stock: 0);
        var product3 = CreateProduct("product3", stock: 5);
        var products = new List<Product> { product1, product2, product3 };

        // Act
        var result = products.AsQueryable().Where(spec.Criteria);

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(p => p.StockQuantity > 0);
    }

    [Fact]
    public void ProductsByCategorySpecification_ShouldFilterByCategory()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var spec = new ProductsByCategorySpecification(categoryId);

        var product1 = CreateProduct("product1", categoryId: categoryId);
        var product2 = CreateProduct("product2", categoryId: Guid.NewGuid());
        var products = new List<Product> { product1, product2 };

        // Act
        var result = products.AsQueryable().Where(spec.Criteria);

        // Assert
        result.Should().ContainSingle();
        result.First().CategoryId.Should().Be(categoryId);
    }

    private Product CreateProduct(
        string slug, 
        decimal price = 50, 
        int stock = 100,
        Guid? categoryId = null)
    {
        return Product.Create(
            "Test Product",
            "Description",
            Money.Create(price, "BDT"),
            stock,
            Guid.NewGuid(),
            "image.jpg",
            Guid.NewGuid(),
            Guid.NewGuid(),
            categoryId ?? Guid.NewGuid(),
            SeoMetadata.Create(slug, "Title", "Description"));
    }
}
