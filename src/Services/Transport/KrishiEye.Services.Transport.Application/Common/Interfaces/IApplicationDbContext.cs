using KrishiEye.Services.Transport.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Transport.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TransporterProfile> TransporterProfiles { get; }
    DbSet<Driver> Drivers { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<TransportRequest> TransportRequests { get; }
    DbSet<TransportBid> TransportBids { get; }
    DbSet<JobAssignment> JobAssignments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
