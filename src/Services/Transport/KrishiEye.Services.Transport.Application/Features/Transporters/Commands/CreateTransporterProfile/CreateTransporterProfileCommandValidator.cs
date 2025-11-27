using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.Transporters.Commands.CreateTransporterProfile;

public class CreateTransporterProfileCommandValidator : AbstractValidator<CreateTransporterProfileCommand>
{
    public CreateTransporterProfileCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.");

        RuleFor(v => v.ContactNumber)
            .NotEmpty().WithMessage("Contact number is required.")
            .Matches(@"^(\+88)?01[3-9]\d{8}$").WithMessage("Invalid Bangladesh mobile number format.");

        RuleFor(v => v.TradeLicenseNumber)
            .NotEmpty().When(v => v.Type == Domain.Enums.TransporterType.Agency)
            .WithMessage("Trade license number is required for agencies.");

        RuleFor(v => v.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Invalid latitude.");

        RuleFor(v => v.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Invalid longitude.");

        RuleFor(v => v.AddressLine)
            .NotEmpty().WithMessage("Address line is required.");
            
        RuleFor(v => v.Division).NotEmpty();
        RuleFor(v => v.District).NotEmpty();
        RuleFor(v => v.Thana).NotEmpty();
    }
}
