using KrishiEye.Services.Transport.Domain.Common;

namespace KrishiEye.Services.Transport.Domain.ValueObjects;

/// <summary>
/// Value object representing money with currency
/// Immutable by design (DDD Value Object pattern)
/// </summary>
public sealed class Money : ValueObject
{
    public decimal Amount { get; private init; }
    public string Currency { get; private init; }

    private Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    /// <summary>
    /// Factory method to create Money in BDT (Bangladeshi Taka)
    /// </summary>
    public static Money Bdt(decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Amount cannot be negative", nameof(amount));

        return new Money(amount, "BDT");
    }

    /// <summary>
    /// Factory method to create Money with specified currency
    /// </summary>
    public static Money Create(decimal amount, string currency)
    {
        if (amount < 0)
            throw new ArgumentException("Amount cannot be negative", nameof(amount));

        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Currency cannot be empty", nameof(currency));

        return new Money(amount, currency.ToUpper());
    }

    /// <summary>
    /// Add two money values (must be same currency)
    /// </summary>
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException($"Cannot add {Currency} and {other.Currency}");

        return new Money(Amount + other.Amount, Currency);
    }

    /// <summary>
    /// Subtract two money values (must be same currency)
    /// </summary>
    public Money Subtract(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException($"Cannot subtract {other.Currency} from {Currency}");

        if (Amount < other.Amount)
            throw new InvalidOperationException("Result cannot be negative");

        return new Money(Amount - other.Amount, Currency);
    }

    /// <summary>
    /// Multiply money by a factor
    /// </summary>
    public Money Multiply(decimal factor)
    {
        if (factor < 0)
            throw new ArgumentException("Factor cannot be negative", nameof(factor));

        return new Money(Amount * factor, Currency);
    }

    public static bool operator >(Money left, Money right)
    {
        if (left.Currency != right.Currency)
            throw new InvalidOperationException($"Cannot compare {left.Currency} and {right.Currency}");

        return left.Amount > right.Amount;
    }

    public static bool operator <(Money left, Money right)
    {
        if (left.Currency != right.Currency)
            throw new InvalidOperationException($"Cannot compare {left.Currency} and {right.Currency}");

        return left.Amount < right.Amount;
    }

    public static bool operator >=(Money left, Money right)
    {
        return left > right || left == right;
    }

    public static bool operator <=(Money left, Money right)
    {
        return left < right || left == right;
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }

    public override string ToString()
    {
        return $"{Amount:N2} {Currency}";
    }
}
