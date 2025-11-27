namespace KrishiEye.Services.Catalog.Infrastructure.Caching;

/// <summary>
/// Utility for generating consistent cache keys.
/// </summary>
public static class CacheKeys
{
    private const string Prefix = "KrishiEye:Catalog:";

    public static class Products
    {
        public static string ById(Guid id) => $"{Prefix}Product:{id}";
        public static string BySlug(string slug) => $"{Prefix}Product:Slug:{slug}";
        public static string ByCategory(Guid categoryId) => $"{Prefix}Product:Category:{categoryId}";
        public static string ByProductType(Guid productTypeId) => $"{Prefix}Product:ProductType:{productTypeId}";
        public static string SearchResults(string searchTerm) => $"{Prefix}Product:Search:{searchTerm.ToLowerInvariant()}";
        public static string AllPrefix => $"{Prefix}Product:";
    }

    public static class Categories
    {
        public static string ById(Guid id) => $"{Prefix}Category:{id}";
        public static string Hierarchy => $"{Prefix}Category:Hierarchy";
        public static string AllPrefix => $"{Prefix}Category:";
    }

    public static class ProductTypes
    {
        public static string ById(Guid id) => $"{Prefix}ProductType:{id}";
        public static string All => $"{Prefix}ProductType:All";
        public static string AllPrefix => $"{Prefix}ProductType:";
    }

    public static class Units
    {
        public static string ById(Guid id) => $"{Prefix}Unit:{id}";
        public static string All => $"{Prefix}Unit:All";
        public static string AllPrefix => $"{Prefix}Unit:";
    }
}
