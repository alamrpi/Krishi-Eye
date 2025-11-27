using KrishiEye.Services.Catalog.Domain.Entities;

namespace KrishiEye.Services.Catalog.Application.Units.Common;

public class UnitDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public UnitType UnitType { get; set; }
    public DateTime CreatedAt { get; set; }
}
