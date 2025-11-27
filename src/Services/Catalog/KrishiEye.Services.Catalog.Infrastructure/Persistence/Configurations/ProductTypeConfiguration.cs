using KrishiEye.Services.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KrishiEye.Services.Catalog.Infrastructure.Persistence.Configurations;

public class ProductTypeConfiguration : IEntityTypeConfiguration<ProductType>
{
    public void Configure(EntityTypeBuilder<ProductType> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        // Configure SeoMetadata as owned entity (complex type)
        builder.OwnsOne(e => e.SeoMetadata, seo =>
        {
            seo.Property(s => s.UrlSlug)
                .IsRequired()
                .HasMaxLength(150)
                .HasColumnName("UrlSlug");

            seo.Property(s => s.MetaTitle)
                .IsRequired()
                .HasMaxLength(70)
                .HasColumnName("MetaTitle");

            seo.Property(s => s.MetaDescription)
                .IsRequired()
                .HasMaxLength(160)
                .HasColumnName("MetaDescription");

            seo.Property(s => s.MetaKeywords)
                .HasMaxLength(250)
                .HasColumnName("MetaKeywords");

            seo.Property(s => s.OgTitle)
                .HasMaxLength(90)
                .HasColumnName("OgTitle");

            seo.Property(s => s.OgDescription)
                .HasMaxLength(200)
                .HasColumnName("OgDescription");

            seo.Property(s => s.OgImage)
                .HasMaxLength(500)
                .HasColumnName("OgImage");

            // Index on UrlSlug within owned entity
            seo.HasIndex(s => s.UrlSlug).IsUnique();
        });
    }
}
