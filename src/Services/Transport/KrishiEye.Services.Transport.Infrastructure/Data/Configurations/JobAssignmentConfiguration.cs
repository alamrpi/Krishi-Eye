using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for JobAssignment
/// </summary>
public class JobAssignmentConfiguration : IEntityTypeConfiguration<JobAssignment>
{
    public void Configure(EntityTypeBuilder<JobAssignment> builder)
    {
        builder.ToTable("JobAssignments");

        builder.HasKey(j => j.Id);

        builder.Property(j => j.RequestId)
            .IsRequired();

        builder.HasIndex(j => j.RequestId)
            .IsUnique()
            .HasDatabaseName("IX_JobAssignments_Request");

        builder.Property(j => j.VehicleId)
            .IsRequired();

        builder.Property(j => j.DriverId)
            .IsRequired();

        builder.Property(j => j.AssignedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW()");

        builder.Property(j => j.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(j => j.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Navigation properties
        builder.HasOne(j => j.Vehicle)
            .WithMany()
            .HasForeignKey(j => j.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(j => j.Driver)
            .WithMany()
            .HasForeignKey(j => j.DriverId)
            .OnDelete(DeleteBehavior.Restrict);

        // Ignore domain events
        builder.Ignore(j => j.DomainEvents);
    }
}
