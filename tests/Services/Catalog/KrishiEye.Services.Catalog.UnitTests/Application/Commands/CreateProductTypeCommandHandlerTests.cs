using FluentAssertions;
using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Application.ProductTypes.Commands.CreateProductType;
using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using Moq;
using Xunit;

namespace KrishiEye.Services.Catalog.UnitTests.Application.Commands;

public class CreateProductTypeCommandHandlerTests
{
    private readonly Mock<ICatalogDbContext> _mockContext;
    private readonly CreateProductTypeCommandHandler _handler;

    public CreateProductTypeCommandHandlerTests()
    {
        _mockContext = new Mock<ICatalogDbContext>();
        _handler = new CreateProductTypeCommandHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateProductType()
    {
        // Arrange
        var command = new CreateProductTypeCommand(
            Name: "Dairy Products",
            Description: "Milk, cheese, yogurt",
            UrlSlug: "dairy-products",
            MetaTitle: "Fresh Dairy Products",
            MetaDescription: "Buy fresh dairy products from farms");

        ProductType? capturedProductType = null;
        _mockContext.Setup(x => x.ProductTypes.Add(It.IsAny<ProductType>()))
            .Callback<ProductType>(pt => capturedProductType = pt);

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        capturedProductType.Should().NotBeNull();
        capturedProductType!.Name.Should().Be(command.Name);
        capturedProductType.Description.Should().Be(command.Description);
        capturedProductType.SeoMetadata.UrlSlug.Should().Be(command.UrlSlug);

        _mockContext.Verify(x => x.ProductTypes.Add(It.IsAny<ProductType>()), Times.Once);
        _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnProductTypeId()
    {
        // Arrange
        var command = new CreateProductTypeCommand(
            "Test", "Description", "test", "Test", "Description");

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().NotBe(Guid.Empty);
    }
}
