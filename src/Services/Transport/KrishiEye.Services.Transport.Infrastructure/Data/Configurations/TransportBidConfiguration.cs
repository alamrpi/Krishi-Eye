using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KrishiEye.Services.Transport.Domain.Entities;
using KrishiEye.Services.Transport.Domain.ValueObjects;

namespace KrishiEye.Services.Transport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for TransportBid with Money value object
/// </summary>
public class TransportBidConfiguration : IEntityTypeConfiguration<TransportBid>
{
    public void Configure(EntityTypeBuilder<TransportBid> builder)
    {
        builder.ToTable("TransportBids");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.RequestId)
            .IsRequired();

        builder.Property(b => b.TransporterId)
            .IsRequired();

        // Composite index for bid queries
        builder.HasIndex(b => new { b.RequestId, b.TransporterId })
            .IsUnique()
            .HasDatabaseName("IX_TransportBids_Request_Transporter");

        // Value Object - Money
        builder.OwnsOne(b => b.BidAmount, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("BidAmount")
                .IsRequired()
                .HasPrecision(10, 2);

            money.Property(m => m.Currency)
                .HasColumnName("Currency")
                .IsRequired()
                .HasMaxLength(3)
                .HasDefaultValue("BDT");
        });

        builder.Property(b => b.BidTime)
            .IsRequired()
            .HasDefaultValueSql("NOW()");

        builder.Property(b => b.Note)
            .HasMaxLength(500);

        builder.Property(b => b.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasDefaultValue(Domain.Enums.BidStatus.Pending);

        builder.HasIndex(b => b.Status)
            .HasDatabaseName("IX_TransportBids_Status");

        builder.Property(b => b.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(b => b.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Ignore domain events
        builder.Ignore(b => b.DomainEvents);
    }
}
