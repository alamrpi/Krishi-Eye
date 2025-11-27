namespace KrishiEye.Services.Catalog.Application.Categories.Common;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ProductTypeId { get; set; }
    public string ProductTypeName { get; set; } = string.Empty;
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public string UrlSlug { get; set; } = string.Empty;
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
