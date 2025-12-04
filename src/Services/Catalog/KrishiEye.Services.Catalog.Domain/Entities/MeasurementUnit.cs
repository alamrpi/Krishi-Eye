using System;

namespace KrishiEye.Services.Catalog.Domain.Entities
{
    public class MeasurementUnit
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty; // e.g., "Kilogram"
        public string Symbol { get; set; } = string.Empty; // e.g., "kg"
        public Guid? OwnerId { get; set; } // Null for Global, User ID for Custom
        public bool IsGlobal { get; set; } // true = System defined, false = User defined
    }
}
