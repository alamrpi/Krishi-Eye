using KrishiEye.Services.Catalog.Domain.Entities;

namespace KrishiEye.Services.Catalog.Domain.Repositories;

/// <summary>
/// Repository interface for Product-specific queries.
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken = default);
    Task<List<Product>> GetByProductTypeIdAsync(Guid productTypeId, CancellationToken cancellationToken = default);
    Task<List<Product>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
}
