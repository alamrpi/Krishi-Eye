using KrishiEye.Services.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KrishiEye.Services.Catalog.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(2000);

        builder.Property(e => e.ImageUrl)
            .HasMaxLength(500);

        builder.Property(e => e.StockQuantity)
            .IsRequired();

        // Configure Money as owned entity (complex type)
        builder.OwnsOne(e => e.Price, money =>
        {
            money.Property(m => m.Amount)
                .IsRequired()
                .HasColumnType("decimal(18,2)")
                .HasColumnName("Price");

            money.Property(m => m.Currency)
                .IsRequired()
                .HasMaxLength(3)
                .HasColumnName("Currency");
        });

        // Configure SeoMetadata as owned entity (complex type)
        builder.OwnsOne(e => e.SeoMetadata, seo =>
        {
            seo.Property(s => s.UrlSlug)
                .IsRequired()
                .HasMaxLength(250)
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

            // Index on UrlSlug for SEO lookup
            seo.HasIndex(s => s.UrlSlug).IsUnique();
        });

        // Unit Relationship
        builder.HasOne(e => e.Unit)
            .WithMany()
            .HasForeignKey(e => e.UnitId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProductType Relationship
        builder.HasOne(e => e.ProductType)
            .WithMany()
            .HasForeignKey(e => e.ProductTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Category Relationship
        builder.HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Index for seller's products
        builder.HasIndex(e => e.SellerId);

        // Index for filtering by ProductType
        builder.HasIndex(e => e.ProductTypeId);

        // Index for filtering by Category
        builder.HasIndex(e => e.CategoryId);

        // Index for Unit
        builder.HasIndex(e => e.UnitId);
    }
}
