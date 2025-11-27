using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Common;
using KrishiEye.Services.Catalog.Domain.Repositories;
using KrishiEye.Services.Catalog.Domain.Specifications;
using KrishiEye.Services.Catalog.Infrastructure.Persistence;
using KrishiEye.Services.Catalog.Infrastructure.Specifications;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation with specification support.
/// </summary>
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly CatalogDbContext _dbContext;
    protected readonly DbSet<T> _dbSet;

    public Repository(ICatalogDbContext context)
    {
        _dbContext = (CatalogDbContext)context;
        _dbSet = _dbContext.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public virtual async Task<List<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public virtual async Task<T?> GetBySpecAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync(cancellationToken);
    }

    public virtual async Task<List<T>> GetListBySpecAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).ToListAsync(cancellationToken);
    }

    public virtual async Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).CountAsync(cancellationToken);
    }

    public virtual async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public virtual void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), spec);
    }
}
