using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.Specifications;

namespace KrishiEye.Services.Catalog.Application.Products.Specifications;

/// <summary>
/// Specification for finding a product by its URL slug.
/// </summary>
public class ProductBySlugSpecification : BaseSpecification<Product>
{
    public ProductBySlugSpecification(string slug) 
        : base(p => p.SeoMetadata.UrlSlug == slug)
    {
        AddInclude(p => p.ProductType);
        AddInclude(p => p.Category);
        AddInclude(p => p.Unit);
    }
}

/// <summary>
/// Specification for finding products by category.
/// </summary>
public class ProductsByCategorySpecification : BaseSpecification<Product>
{
    public ProductsByCategorySpecification(Guid categoryId)
        : base(p => p.CategoryId == categoryId)
    {
        AddInclude(p => p.ProductType);
        AddInclude(p => p.Category);
        AddInclude(p => p.Unit);
    }
}

/// <summary>
/// Specification for finding products within a price range.
/// </summary>
public class ProductsByPriceRangeSpecification : BaseSpecification<Product>
{
    public ProductsByPriceRangeSpecification(decimal minPrice, decimal maxPrice)
        : base(p => p.Price.Amount >= minPrice && p.Price.Amount <= maxPrice)
    {
        AddInclude(p => p.ProductType);
        AddInclude(p => p.Category);
        AddInclude(p => p.Unit);
        ApplyOrderBy(p => p.Price.Amount);
    }
}

/// <summary>
/// Specification for finding in-stock products only.
/// </summary>
public class InStockProductsSpecification : BaseSpecification<Product>
{
    public InStockProductsSpecification()
        : base(p => p.StockQuantity > 0)
    {
    }
}

/// <summary>
/// Specification for searching products by name or description.
/// </summary>
public class ProductSearchSpecification : BaseSpecification<Product>
{
    public ProductSearchSpecification(string searchTerm)
        : base(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
    {
        AddInclude(p => p.ProductType);
        AddInclude(p => p.Category);
        AddInclude(p => p.Unit);
    }
}
