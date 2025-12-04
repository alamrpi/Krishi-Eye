using System;
using System.Collections.Generic;

namespace KrishiEye.Services.Catalog.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Guid? ParentId { get; set; }
        public Category? Parent { get; set; }
        public CategoryStatus Status { get; set; } = CategoryStatus.Pending;
        public Guid? RequestedBy { get; set; } // TraderId who requested this category
        public ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public enum CategoryStatus
    {
        Pending,
        Active,
        Rejected
    }
}
