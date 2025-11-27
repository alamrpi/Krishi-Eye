using KrishiEye.Services.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KrishiEye.Services.Catalog.Infrastructure.Persistence.Configurations;

public class MeasurementUnitConfiguration : IEntityTypeConfiguration<MeasurementUnit>
{
    public void Configure(EntityTypeBuilder<MeasurementUnit> builder)
    {
        builder.ToTable("MeasurementUnits");
        
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Symbol)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(e => e.UnitType)
            .IsRequired()
            .HasConversion<int>(); // Store enum as int

        // Unique constraint on Symbol
        builder.HasIndex(e => e.Symbol)
            .IsUnique();
    }
}
