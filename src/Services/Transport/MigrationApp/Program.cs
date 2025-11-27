using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using KrishiEye.Services.Transport.Infrastructure.Data;

namespace KrishiEye.Services.Transport.MigrationApp;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Migration App Started");
    }
}

public class TransportDbContextFactory : IDesignTimeDbContextFactory<TransportDbContext>
{
    public TransportDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TransportDbContext>();
        
        // Use the connection string directly here for migration purposes
        var connectionString = "Host=localhost;Port=5433;Database=KrishiEye_Transport;Username=postgres;Password=Password123!";

        optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.UseNetTopologySuite();
            npgsqlOptions.MigrationsAssembly(typeof(TransportDbContext).Assembly.FullName);
        });

        return new TransportDbContext(optionsBuilder.Options);
    }
}
