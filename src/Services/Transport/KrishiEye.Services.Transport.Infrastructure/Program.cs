using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using KrishiEye.Services.Transport.Infrastructure.Data;

namespace KrishiEye.Services.Transport.Infrastructure;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Infrastructure Migration Host");
    }
}

public class TransportDbContextFactory : IDesignTimeDbContextFactory<TransportDbContext>
{
    public TransportDbContext CreateDbContext(string[] args)
    {
        try
        {
            var optionsBuilder = new DbContextOptionsBuilder<TransportDbContext>();
            var connectionString = "Host=localhost;Port=5433;Database=KrishiEye_Transport;Username=postgres;Password=Password123!";

            optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.UseNetTopologySuite();
                npgsqlOptions.MigrationsAssembly(typeof(TransportDbContext).Assembly.FullName);
            });

            return new TransportDbContext(optionsBuilder.Options);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating DbContext: {ex}");
            throw;
        }
    }
}
