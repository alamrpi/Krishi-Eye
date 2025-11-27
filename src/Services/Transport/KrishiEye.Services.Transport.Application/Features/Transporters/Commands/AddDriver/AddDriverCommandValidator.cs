using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddDriver;

public class AddDriverCommandValidator : AbstractValidator<AddDriverCommand>
{
    public AddDriverCommandValidator()
    {
        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(100).WithMessage("Full name must not exceed 100 characters.");

        RuleFor(v => v.Phone)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^(\+88)?01[3-9]\d{8}$").WithMessage("Invalid Bangladesh mobile number format.");

        RuleFor(v => v.NidNumber)
            .NotEmpty().WithMessage("NID number is required.")
            .Matches(@"^\d{10}$|^\d{13}$|^\d{17}$").WithMessage("NID must be 10, 13, or 17 digits.");

        RuleFor(v => v.LicenseNumber)
            .NotEmpty().WithMessage("License number is required.")
            .MaximumLength(50).WithMessage("License number must not exceed 50 characters.");

        RuleFor(v => v.LicenseExpiryDate)
            .NotEmpty().WithMessage("License expiry date is required.")
            .GreaterThan(DateTime.UtcNow).WithMessage("License must not be expired.");

        RuleFor(v => v.LicenseImageUrl)
            .NotEmpty().WithMessage("License image URL is required.")
            .MaximumLength(500).WithMessage("License image URL must not exceed 500 characters.");
    }
}
