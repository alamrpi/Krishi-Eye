using KrishiEye.Services.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Application.Common.Interfaces;

public interface ICatalogDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<ProductType> ProductTypes { get; }
    DbSet<MeasurementUnit> MeasurementUnits { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
