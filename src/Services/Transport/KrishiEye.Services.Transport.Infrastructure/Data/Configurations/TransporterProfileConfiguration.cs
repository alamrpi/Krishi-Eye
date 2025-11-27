using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;
using NetTopologySuite.Geometries;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for TransporterProfile with spatial indexes
/// </summary>
public class TransporterProfileConfiguration : IEntityTypeConfiguration<TransporterProfile>
{
    public void Configure(EntityTypeBuilder<TransporterProfile> builder)
    {
        builder.ToTable("TransporterProfiles");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.UserId)
            .IsRequired();

        builder.HasIndex(t => t.UserId)
            .IsUnique();

        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(t => t.CompanyName)
            .HasMaxLength(100);

        builder.Property(t => t.TradeLicenseNo)
            .HasMaxLength(50);

        builder.Property(t => t.BaseLatitude)
            .IsRequired()
            .HasPrecision(9, 6);

        builder.Property(t => t.BaseLongitude)
            .IsRequired()
            .HasPrecision(9, 6);

        // Spatial index for geo-queries (PostGIS GIST index)
        builder.HasIndex(t => new { t.BaseLatitude, t.BaseLongitude })
            .HasDatabaseName("IX_TransporterProfiles_Location");

        builder.Property(t => t.ServiceRadiusKm)
            .HasDefaultValue(50);

        builder.Property(t => t.IsVerified)
            .HasDefaultValue(false);

        builder.Property(t => t.Rating)
            .HasPrecision(3, 1)
            .HasDefaultValue(0.0m);

        builder.Property(t => t.TotalJobs)
            .HasDefaultValue(0);

        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(t => t.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Navigation properties
        builder.HasMany(t => t.Drivers)
            .WithOne(d => d.Transporter)
            .HasForeignKey(d => d.TransporterId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.Vehicles)
            .WithOne(v => v.Transporter)
            .HasForeignKey(v => v.TransporterId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.Bids)
            .WithOne(b => b.Transporter)
            .HasForeignKey(b => b.TransporterId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
