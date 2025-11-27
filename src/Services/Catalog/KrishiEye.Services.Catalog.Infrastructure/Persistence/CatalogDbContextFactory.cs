using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KrishiEye.Services.Catalog.Infrastructure.Persistence;

/// <summary>
/// Design-time factory for creating CatalogDbContext instances during migrations.
/// </summary>
public class CatalogDbContextFactory : IDesignTimeDbContextFactory<CatalogDbContext>
{
    public CatalogDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CatalogDbContext>();

        // Use a connection string for design-time
        optionsBuilder.UseSqlServer(
            "Server=localhost,1433;Database=KrishiEye_Catalog_Design;User Id=sa;Password=Password123!;TrustServerCertificate=True");

        return new CatalogDbContext(optionsBuilder.Options);
    }
}
