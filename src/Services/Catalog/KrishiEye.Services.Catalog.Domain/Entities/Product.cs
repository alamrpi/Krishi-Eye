using System;
using System.Collections.Generic;

namespace KrishiEye.Services.Catalog.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; } // User who listed the product
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty; // SEO Friendly URL
        public string Description { get; set; } = string.Empty;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public decimal Price { get; set; }
        public Guid UnitId { get; set; }
        public MeasurementUnit? MeasurementUnit { get; set; }
        public decimal StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public List<string> Images { get; set; } = new List<string>(); // JSONB
        public Location? Location { get; set; } // JSONB
        public bool IsTransportIncluded { get; set; }
        public bool IsPublished { get; set; }
        public bool IsActive { get; set; } = true;
        public ProductStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum ProductStatus
    {
        Draft,
        Active,
        OutOfStock,
        Archived
    }

    public class Location
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Division { get; set; } = string.Empty;
    }
}
