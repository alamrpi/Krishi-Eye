using FluentAssertions;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using Xunit;

namespace KrishiEye.Services.Catalog.UnitTests.Domain.ValueObjects;

public class MoneyTests
{
    [Fact]
    public void Create_WithValidValues_ShouldCreateMoney()
    {
        // Arrange & Act
        var money = Money.Create(100, "BDT");

        // Assert
        money.Should().NotBeNull();
        money.Amount.Should().Be(100);
        money.Currency.Should().Be("BDT");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    [InlineData(-100.50)]
    public void Create_WithNonPositiveAmount_ShouldThrowException(decimal amount)
    {
        // Act
        var action = () => Money.Create(amount, "BDT");

        // Assert
        action.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public void Create_WithInvalidCurrency_ShouldThrowException(string currency)
    {
        // Act
        var action = () => Money.Create(100, currency);

        // Assert
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Equality_WithSameValues_ShouldBeEqual()
    {
        // Arrange
        var money1 = Money.Create(100, "BDT");
        var money2 = Money.Create(100, "BDT");

        // Act & Assert
        money1.Should().Be(money2);
        (money1 == money2).Should().BeTrue();
    }

    [Fact]
    public void Equality_WithDifferentAmounts_ShouldNotBeEqual()
    {
        // Arrange
        var money1 = Money.Create(100, "BDT");
        var money2 = Money.Create(200, "BDT");

        // Act & Assert
        money1.Should().NotBe(money2);
        (money1 != money2).Should().BeTrue();
    }

    [Fact]
    public void Equality_WithDifferentCurrencies_ShouldNotBeEqual()
    {
        // Arrange
        var money1 = Money.Create(100, "BDT");
        var money2 = Money.Create(100, "USD");

        // Act & Assert
        money1.Should().NotBe(money2);
    }
}
