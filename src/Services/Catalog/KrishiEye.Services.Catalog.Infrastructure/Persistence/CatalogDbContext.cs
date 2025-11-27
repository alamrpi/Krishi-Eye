using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Infrastructure.Persistence;

public class CatalogDbContext : DbContext, ICatalogDbContext
{
    public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductType> ProductTypes => Set<ProductType>();
    public DbSet<MeasurementUnit> MeasurementUnits => Set<MeasurementUnit>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Apply all configurations from the Configurations folder
        builder.ApplyConfigurationsFromAssembly(typeof(CatalogDbContext).Assembly);
    }
}
