using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.ValueObjects;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for TransportRequest with PostGIS spatial columns
/// </summary>
public class TransportRequestConfiguration : IEntityTypeConfiguration<TransportRequest>
{
    public void Configure(EntityTypeBuilder<TransportRequest> builder)
    {
        builder.ToTable("TransportRequests");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.RequesterId)
            .IsRequired();

        builder.HasIndex(r => r.RequesterId)
            .HasDatabaseName("IX_TransportRequests_Requester");

        builder.Property(r => r.ScheduledTime)
            .IsRequired();

        // Pickup location
        builder.Property(r => r.PickupAddress)
            .IsRequired()
            .HasMaxLength(500);

        // Value Object - Location for Pickup (Complete Bangladesh Address)
        builder.OwnsOne(r => r.PickupLocation, location =>
        {
            location.Property(l => l.Latitude)
                .HasColumnName("PickupLatitude")
                .IsRequired()
                .HasPrecision(9, 6);

            location.Property(l => l.Longitude)
                .HasColumnName("PickupLongitude")
                .IsRequired()
                .HasPrecision(9, 6);

            location.Property(l => l.Division)
                .HasColumnName("PickupDivision")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.District)
                .HasColumnName("PickupDistrict")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.Thana)
                .HasColumnName("PickupThana")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.PostalCode)
                .HasColumnName("PickupPostalCode")
                .HasMaxLength(10);

            location.Property(l => l.AddressLine)
                .HasColumnName("PickupAddressLine")
                .IsRequired()
                .HasMaxLength(500);
        });

        // Drop location
        builder.Property(r => r.DropAddress)
            .IsRequired()
            .HasMaxLength(500);

        // Value Object - Location for Drop (Complete Bangladesh Address)
        builder.OwnsOne(r => r.DropLocation, location =>
        {
            location.Property(l => l.Latitude)
                .HasColumnName("DropLatitude")
                .IsRequired()
                .HasPrecision(9, 6);

            location.Property(l => l.Longitude)
                .HasColumnName("DropLongitude")
                .IsRequired()
                .HasPrecision(9, 6);

            location.Property(l => l.Division)
                .HasColumnName("DropDivision")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.District)
                .HasColumnName("DropDistrict")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.Thana)
                .HasColumnName("DropThana")
                .IsRequired()
                .HasMaxLength(50);

            location.Property(l => l.PostalCode)
                .HasColumnName("DropPostalCode")
                .HasMaxLength(10);

            location.Property(l => l.AddressLine)
                .HasColumnName("DropAddressLine")
                .IsRequired()
                .HasMaxLength(500);
        });

        // Spatial index for pickup location (PostGIS GIST)
        builder.HasIndex("PickupLatitude", "PickupLongitude")
            .HasDatabaseName("IX_TransportRequests_PickupLocation");

        // Index for pickup district for area-based queries
        builder.HasIndex("PickupDistrict")
            .HasDatabaseName("IX_TransportRequests_PickupDistrict");

        builder.Property(r => r.GoodsType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.WeightKg)
            .IsRequired()
            .HasPrecision(10, 2);

        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasDefaultValue(Domain.Enums.RequestStatus.Open);

        builder.HasIndex(r => r.Status)
            .HasDatabaseName("IX_TransportRequests_Status");

        builder.Property(r => r.WinnerBidId);

        builder.Property(r => r.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(r => r.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Navigation properties
        builder.HasMany(r => r.Bids)
            .WithOne(b => b.Request)
            .HasForeignKey(b => b.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.JobAssignment)
            .WithOne(j => j.Request)
            .HasForeignKey<JobAssignment>(j => j.RequestId)
            .OnDelete(DeleteBehavior.Restrict);

        // Ignore domain events (not persisted)
        builder.Ignore(r => r.DomainEvents);
    }
}
