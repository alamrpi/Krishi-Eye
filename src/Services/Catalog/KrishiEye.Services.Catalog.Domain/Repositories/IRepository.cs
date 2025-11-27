using KrishiEye.Services.Catalog.Domain.Common;
using KrishiEye.Services.Catalog.Domain.Repositories;
using KrishiEye.Services.Catalog.Domain.Specifications;

namespace KrishiEye.Services.Catalog.Domain.Repositories;

/// <summary>
/// Extended repository interface with specification support.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<T?> GetBySpecAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);
    Task<List<T>> GetListBySpecAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);
    Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Delete(T entity);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
