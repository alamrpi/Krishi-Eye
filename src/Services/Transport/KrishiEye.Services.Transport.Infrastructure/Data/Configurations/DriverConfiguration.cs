using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for Driver with license validation
/// </summary>
public class DriverConfiguration : IEntityTypeConfiguration<Driver>
{
    public void Configure(EntityTypeBuilder<Driver> builder)
    {
        builder.ToTable("Drivers");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.FullName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.Phone)
            .IsRequired()
            .HasMaxLength(15);

        builder.Property(d => d.LicenseNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(d => d.LicenseNumber)
            .IsUnique();

        builder.Property(d => d.LicenseExpiryDate)
            .IsRequired();

        builder.Property(d => d.LicenseImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(d => d.NidNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(d => d.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasDefaultValue(Domain.Enums.DriverStatus.Active);

        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(d => d.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Index for active driver queries
        builder.HasIndex(d => new { d.TransporterId, d.Status })
            .HasDatabaseName("IX_Drivers_Transporter_Status");
    }
}
