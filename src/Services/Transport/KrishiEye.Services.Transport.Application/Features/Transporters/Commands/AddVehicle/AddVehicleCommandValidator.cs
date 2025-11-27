using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddVehicle;

public class AddVehicleCommandValidator : AbstractValidator<AddVehicleCommand>
{
    public AddVehicleCommandValidator()
    {
        RuleFor(v => v.Type)
            .IsInEnum().WithMessage("Invalid vehicle type.");

        RuleFor(v => v.RegistrationNumber)
            .NotEmpty().WithMessage("Registration number is required.")
            .MaximumLength(50).WithMessage("Registration number must not exceed 50 characters.");

        RuleFor(v => v.CapacityTon)
            .GreaterThan(0).WithMessage("Capacity must be greater than 0.")
            .LessThanOrEqualTo(50).WithMessage("Capacity must not exceed 50 tons.");

        RuleFor(v => v.Model)
            .MaximumLength(100).When(v => !string.IsNullOrEmpty(v.Model))
            .WithMessage("Model must not exceed 100 characters.");

        RuleFor(v => v.ManufactureYear)
            .GreaterThanOrEqualTo(1980).When(v => v.ManufactureYear.HasValue)
            .WithMessage("Manufacture year must be 1980 or later.")
            .LessThanOrEqualTo(DateTime.UtcNow.Year + 1).When(v => v.ManufactureYear.HasValue)
            .WithMessage("Manufacture year cannot be in the future.");

        RuleFor(v => v.FitnessExpiryDate)
            .NotEmpty().WithMessage("Fitness expiry date is required.")
            .GreaterThan(DateTime.UtcNow).WithMessage("Fitness certificate must not be expired.");
    }
}
