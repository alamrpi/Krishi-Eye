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

        builder.Property(t => t.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(t => t.ContactNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(t => t.TradeLicenseNumber)
            .HasMaxLength(50);

        builder.OwnsOne(t => t.Location, location =>
        {
            location.Property(l => l.Latitude).HasColumnName("Latitude").IsRequired();
            location.Property(l => l.Longitude).HasColumnName("Longitude").IsRequired();
            location.Property(l => l.AddressLine).HasColumnName("AddressLine").HasMaxLength(500);
            location.Property(l => l.Division).HasColumnName("Division").HasMaxLength(100);
            location.Property(l => l.District).HasColumnName("District").HasMaxLength(100);
            location.Property(l => l.Thana).HasColumnName("Thana").HasMaxLength(100);
            location.Property(l => l.PostalCode).HasColumnName("PostalCode").HasMaxLength(20);
            
            // Spatial index
            location.HasIndex(l => new { l.Latitude, l.Longitude })
                .HasDatabaseName("IX_TransporterProfiles_Location");
        });

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
