using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.Specifications;

namespace KrishiEye.Services.Catalog.Application.Products.Specifications;

/// <summary>
/// Specification for finding products by seller ID.
/// </summary>
public class ProductsBySellerSpecification : BaseSpecification<Product>
{
    public ProductsBySellerSpecification(Guid sellerId)
        : base(p => p.SellerId == sellerId)
    {
        AddInclude(p => p.ProductType);
        AddInclude(p => p.Category);
        AddInclude(p => p.Unit);
        ApplyOrderByDescending(p => p.CreatedAt);
    }
}
