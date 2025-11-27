namespace KrishiEye.Services.Catalog.Infrastructure.Caching;

/// <summary>
/// Cache configuration settings.
/// </summary>
public class CacheSettings
{
    public const string SectionName = "CacheSettings";

    public bool EnableCaching { get; set; } = true;
    public TimeSpan ProductCacheDuration { get; set; } = TimeSpan.FromMinutes(30);
    public TimeSpan CategoryCacheDuration { get; set; } = TimeSpan.FromHours(1);
    public TimeSpan SearchResultCacheDuration { get; set; } = TimeSpan.FromMinutes(5);
    public TimeSpan DefaultCacheDuration { get; set; } = TimeSpan.FromMinutes(15);
}
