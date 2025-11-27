using System.Reflection;
using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.Domain.Common;
using KrishiEye.Services.Transport.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KrishiEye.Services.Transport.Infrastructure.Data;

public class TransportDbContext : DbContext, IApplicationDbContext
{
    public TransportDbContext(DbContextOptions<TransportDbContext> options) : base(options) { }

    public DbSet<TransporterProfile> TransporterProfiles => Set<TransporterProfile>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<TransportRequest> TransportRequests => Set<TransportRequest>();
    public DbSet<TransportBid> TransportBids => Set<TransportBid>();
    public DbSet<JobAssignment> JobAssignments => Set<JobAssignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TransportDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update timestamps for modified entities
        var entries = ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            entry.Property(nameof(BaseEntity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }

        // Save changes
        var result = await base.SaveChangesAsync(cancellationToken);

        // TODO: Dispatch domain events here (will be implemented with MediatR)

        return result;
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
