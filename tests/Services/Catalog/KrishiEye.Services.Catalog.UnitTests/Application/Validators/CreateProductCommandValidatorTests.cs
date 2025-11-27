using FluentAssertions;
using KrishiEye.Services.Catalog.Application.Products.Commands.CreateProduct;
using KrishiEye.Services.Catalog.Application.Products.Validators;
using Xunit;

namespace KrishiEye.Services.Catalog.UnitTests.Application.Validators;

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator;

    public CreateProductCommandValidatorTests()
    {
        _validator = new CreateProductCommandValidator();
    }

    [Fact]
    public void Validate_WithValidCommand_ShouldPass()
    {
        // Arrange
        var command = new CreateProductCommand(
            Name: "Organic Tomato",
            Description: "Fresh organic tomatoes from local farm",
            PriceAmount: 50,
            Currency: "BDT",
            StockQuantity: 100,
            UnitId: Guid.NewGuid(),
            ImageUrl: "tomato.jpg",
            SellerId: Guid.NewGuid(),
            ProductTypeId: Guid.NewGuid(),
            CategoryId: Guid.NewGuid(),
            UrlSlug: "organic-tomato",
            MetaTitle: "Fresh Organic Tomato",
            MetaDescription: "Buy fresh organic tomatoes from verified farmers");

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WithEmptyName_ShouldFail(string name)
    {
        // Arrange
        var command = CreateValidCommand() with { Name = name };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Validate_WithTooLongName_ShouldFail()
    {
        // Arrange
        var command = CreateValidCommand() with { Name = new string('a', 201) };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("200"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    public void Validate_WithInvalidPrice_ShouldFail(decimal price)
    {
        // Arrange
        var command = CreateValidCommand() with { PriceAmount = price };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "PriceAmount");
    }

    [Fact]
    public void Validate_WithNegativeStock_ShouldFail()
    {
        // Arrange
        var command = CreateValidCommand() with { StockQuantity = -5 };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "StockQuantity");
    }

    [Theory]
    [InlineData("Invalid Slug")]
    [InlineData("slug@#$")]
    [InlineData("Slug With Spaces")]
    public void Validate_WithInvalidUrlSlug_ShouldFail(string slug)
    {
        // Arrange
        var command = CreateValidCommand() with { UrlSlug = slug };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "UrlSlug");
    }

    [Fact]
    public void Validate_WithTooLongMetaTitle_ShouldFail()
    {
        // Arrange
        var command = CreateValidCommand() with { MetaTitle = new string('a', 71) };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => 
            e.PropertyName == "MetaTitle" && e.ErrorMessage.Contains("70"));
    }

    [Fact]
    public void Validate_WithTooLongMetaDescription_ShouldFail()
    {
        // Arrange
        var command = CreateValidCommand() with { MetaDescription = new string('a', 161) };

        // Act
        var result = _validator.Validate(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => 
            e.PropertyName == "MetaDescription" && e.ErrorMessage.Contains("160"));
    }

    private CreateProductCommand CreateValidCommand()
    {
        return new CreateProductCommand(
            Name: "Organic Tomato",
            Description: "Fresh organic tomatoes",
            PriceAmount: 50,
            Currency: "BDT",
            StockQuantity: 100,
            UnitId: Guid.NewGuid(),
            ImageUrl: "tomato.jpg",
            SellerId: Guid.NewGuid(),
            ProductTypeId: Guid.NewGuid(),
            CategoryId: Guid.NewGuid(),
            UrlSlug: "organic-tomato",
            MetaTitle: "Fresh Organic Tomato",
            MetaDescription: "Buy fresh organic tomatoes");
    }
}
