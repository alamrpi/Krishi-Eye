using KrishiEye.Services.Catalog.Domain.Common;

namespace KrishiEye.Services.Catalog.Domain.Entities;

/// <summary>
/// Represents a unit of measurement for products (e.g., kg, liter, piece).
/// </summary>
public sealed class MeasurementUnit : BaseEntity
{
    public string Name { get; private set; }
    public string Symbol { get; private set; }
    public UnitType UnitType { get; private set; }

    private MeasurementUnit() : base() { } // EF Core

    private MeasurementUnit(string name, string symbol, UnitType unitType) : base()
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Unit name cannot be empty", nameof(name));

        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Unit symbol cannot be empty", nameof(symbol));

        Name = name;
        Symbol = symbol;
        UnitType = unitType;
    }

    public static MeasurementUnit Create(string name, string symbol, UnitType unitType)
    {
        return new MeasurementUnit(name, symbol, unitType);
    }

    // Predefined units (Factory methods)
    public static MeasurementUnit Kilogram() => new MeasurementUnit("Kilogram", "kg", UnitType.Weight);
    public static MeasurementUnit Gram() => new MeasurementUnit("Gram", "g", UnitType.Weight);
    public static MeasurementUnit Liter() => new MeasurementUnit("Liter", "L", UnitType.Volume);
    public static MeasurementUnit Piece() => new MeasurementUnit("Piece", "pc", UnitType.Count);
    public static MeasurementUnit Dozen() => new MeasurementUnit("Dozen", "dz", UnitType.Count);
    public static MeasurementUnit Bag() => new MeasurementUnit("Bag", "bag", UnitType.Container);
}

/// <summary>
/// Enumeration for unit types.
/// </summary>
public enum UnitType
{
    Weight = 1,
    Volume = 2,
    Count = 3,
    Length = 4,
    Area = 5,
    Container = 6
}
