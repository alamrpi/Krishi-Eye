using FluentValidation;
using KrishiEye.Services.Catalog.Application.ProductTypes.Commands.CreateProductType;

namespace KrishiEye.Services.Catalog.Application.ProductTypes.Validators;

public class CreateProductTypeCommandValidator : AbstractValidator<CreateProductTypeCommand>
{
    public CreateProductTypeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product type name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.UrlSlug)
            .NotEmpty().WithMessage("URL slug is required")
            .MaximumLength(150).WithMessage("URL slug cannot exceed 150 characters")
            .Matches("^[a-z0-9-]+$").WithMessage("URL slug can only contain lowercase letters, numbers, and hyphens");

        RuleFor(x => x.MetaTitle)
            .NotEmpty().WithMessage("Meta title is required")
            .MaximumLength(70).WithMessage("Meta title should not exceed 70 characters for SEO");

        RuleFor(x => x.MetaDescription)
            .NotEmpty().WithMessage("Meta description is required")
            .MaximumLength(160).WithMessage("Meta description should not exceed 160 characters for SEO");
    }
}
