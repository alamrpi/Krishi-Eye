namespace KrishiEye.Services.Catalog.Domain.ValueObjects;

/// <summary>
/// SEO Metadata value object (DDD pattern).
/// Encapsulates all SEO-related information for e-commerce optimization.
/// </summary>
public sealed class SeoMetadata : IEquatable<SeoMetadata>
{
    public string UrlSlug { get; private set; }
    public string MetaTitle { get; private set; }
    public string MetaDescription { get; private set; }
    public string? MetaKeywords { get; private set; }
    public string? OgTitle { get; private set; }
    public string? OgDescription { get; private set; }
    public string? OgImage { get; private set; }

    private SeoMetadata() { } // EF Core

    public SeoMetadata(
        string urlSlug,
        string metaTitle,
        string metaDescription,
        string? metaKeywords = null,
        string? ogTitle = null,
        string? ogDescription = null,
        string? ogImage = null)
    {
        if (string.IsNullOrWhiteSpace(urlSlug))
            throw new ArgumentException("URL slug cannot be empty", nameof(urlSlug));

        if (string.IsNullOrWhiteSpace(metaTitle))
            throw new ArgumentException("Meta title cannot be empty", nameof(metaTitle));

        if (string.IsNullOrWhiteSpace(metaDescription))
            throw new ArgumentException("Meta description cannot be empty", nameof(metaDescription));

        if (metaTitle.Length > 70)
            throw new ArgumentException("Meta title should not exceed 70 characters for SEO", nameof(metaTitle));

        if (metaDescription.Length > 160)
            throw new ArgumentException("Meta description should not exceed 160 characters for SEO", nameof(metaDescription));

        UrlSlug = urlSlug.ToLowerInvariant();
        MetaTitle = metaTitle;
        MetaDescription = metaDescription;
        MetaKeywords = metaKeywords;
        OgTitle = ogTitle ?? metaTitle;
        OgDescription = ogDescription ?? metaDescription;
        OgImage = ogImage;
    }

    public static SeoMetadata Create(
        string urlSlug,
        string metaTitle,
        string metaDescription,
        string? metaKeywords = null,
        string? ogTitle = null,
        string? ogDescription = null,
        string? ogImage = null)
    {
        return new SeoMetadata(urlSlug, metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription, ogImage);
    }

    public bool Equals(SeoMetadata? other)
    {
        if (other is null) return false;
        return UrlSlug == other.UrlSlug &&
               MetaTitle == other.MetaTitle &&
               MetaDescription == other.MetaDescription;
    }

    public override bool Equals(object? obj) => Equals(obj as SeoMetadata);

    public override int GetHashCode() => HashCode.Combine(UrlSlug, MetaTitle, MetaDescription);

    public static bool operator ==(SeoMetadata? left, SeoMetadata? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(SeoMetadata? left, SeoMetadata? right) =>
        !(left == right);
}
