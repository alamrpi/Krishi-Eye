using KrishiEye.Services.Transport.Domain.Common;

namespace KrishiEye.Services.Transport.Domain.ValueObjects;

/// <summary>
/// Value object representing a complete Bangladesh address with geographical coordinates
/// Immutable aggregate with Division → District → Thana hierarchy
/// </summary>
public sealed class Location : ValueObject
{
    public decimal Latitude { get; private init; }
    public decimal Longitude { get; private init; }
    
    // Bangladesh administrative hierarchy
    public string Division { get; private init; } = string.Empty;
    public string District { get; private init; } = string.Empty;
    public string Thana { get; private init; } = string.Empty;
    public string PostalCode { get; private init; } = string.Empty;
    
    // Detailed address
    public string AddressLine { get; private init; } = string.Empty;

    private Location() { } // For EF Core

    private Location(
        decimal latitude,
        decimal longitude,
        string division,
        string district,
        string thana,
        string postalCode,
        string addressLine)
    {
        Latitude = latitude;
        Longitude = longitude;
        Division = division;
        District = district;
        Thana = thana;
        PostalCode = postalCode;
        AddressLine = addressLine;
    }

    /// <summary>
    /// Factory method to create a complete Location (Factory Pattern)
    /// </summary>
    public static Location Create(
        decimal latitude,
        decimal longitude,
        string division,
        string district,
        string thana,
        string postalCode,
        string addressLine)
    {
        // Guard clauses for validation
        if (latitude < -90 || latitude > 90)
            throw new ArgumentException("Latitude must be between -90 and 90", nameof(latitude));

        if (longitude < -180 || longitude > 180)
            throw new ArgumentException("Longitude must be between -180 and 180", nameof(longitude));

        if (string.IsNullOrWhiteSpace(division))
            throw new ArgumentException("Division cannot be empty", nameof(division));

        if (string.IsNullOrWhiteSpace(district))
            throw new ArgumentException("District cannot be empty", nameof(district));

        if (string.IsNullOrWhiteSpace(thana))
            throw new ArgumentException("Thana cannot be empty", nameof(thana));

        if (string.IsNullOrWhiteSpace(addressLine))
            throw new ArgumentException("Address line cannot be empty", nameof(addressLine));

        return new Location(latitude, longitude, division, district, thana, postalCode, addressLine);
    }

    /// <summary>
    /// Calculate distance to another location using Haversine formula
    /// Returns distance in kilometers
    /// </summary>
    public double CalculateDistanceKm(Location other)
    {
        const double earthRadiusKm = 6371.0;

        var lat1Rad = DegreesToRadians((double)Latitude);
        var lat2Rad = DegreesToRadians((double)other.Latitude);
        var deltaLat = DegreesToRadians((double)(other.Latitude - Latitude));
        var deltaLon = DegreesToRadians((double)(other.Longitude - Longitude));

        var a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return earthRadiusKm * c;
    }

    /// <summary>
    /// Check if this location is within specified radius of another location
    /// </summary>
    public bool IsWithinRadiusOf(Location other, double radiusKm)
    {
        return CalculateDistanceKm(other) <= radiusKm;
    }

    /// <summary>
    /// Get formatted full address for Bangladesh
    /// </summary>
    public string GetFullAddress()
    {
        return $"{AddressLine}, {Thana}, {District}, {Division}" +
               (string.IsNullOrWhiteSpace(PostalCode) ? "" : $" - {PostalCode}");
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Latitude;
        yield return Longitude;
        yield return Division;
        yield return District;
        yield return Thana;
        yield return PostalCode;
        yield return AddressLine;
    }

    public override string ToString()
    {
        return GetFullAddress();
    }
}
