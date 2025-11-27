using FluentValidation;
using KrishiEye.Services.Catalog.Application.Products.Commands.CreateProduct;

namespace KrishiEye.Services.Catalog.Application.Products.Validators;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Product description is required")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.PriceAmount)
            .GreaterThan(0).WithMessage("Price must be greater than zero");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.ProductTypeId)
            .NotEmpty().WithMessage("Product type is required");

        RuleFor(x => x.UnitId)
            .NotEmpty().WithMessage("Unit is required");

        RuleFor(x => x.SellerId)
            .NotEmpty().WithMessage("Seller is required");

        RuleFor(x => x.UrlSlug)
            .NotEmpty().WithMessage("URL slug is required")
            .MaximumLength(200).WithMessage("URL slug cannot exceed 200 characters")
            .Matches("^[a-z0-9-]+$").WithMessage("URL slug can only contain lowercase letters, numbers, and hyphens");

        RuleFor(x => x.MetaTitle)
            .NotEmpty().WithMessage("Meta title is required for SEO")
            .MaximumLength(70).WithMessage("Meta title should not exceed 70 characters for SEO best practices");

        RuleFor(x => x.MetaDescription)
            .NotEmpty().WithMessage("Meta description is required for SEO")
            .MaximumLength(160).WithMessage("Meta description should not exceed 160 characters for SEO best practices");
    }
}
