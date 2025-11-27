using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for Vehicle with capacity and fitness tracking
/// </summary>
public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("Vehicles");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.RegNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(v => v.RegNumber)
            .IsUnique();

        builder.Property(v => v.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(v => v.CapacityTon)
            .IsRequired()
            .HasPrecision(5, 2);

        builder.Property(v => v.FitnessExpiryDate)
            .IsRequired();

        builder.Property(v => v.DocumentsUrl)
            .HasColumnType("jsonb"); // PostgreSQL JSONB for efficient JSON queries

        builder.Property(v => v.Model)
            .HasMaxLength(100);

        builder.Property(v => v.ManufactureYear);

        builder.Property(v => v.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(v => v.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(v => v.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Index for available vehicle queries
        builder.HasIndex(v => new { v.TransporterId, v.Status })
            .HasDatabaseName("IX_Vehicles_Transporter_Status");
    }
}
