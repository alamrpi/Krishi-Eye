using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.TransportRequests.Commands.CreateTransportRequest;

public class CreateTransportRequestCommandValidator : AbstractValidator<CreateTransportRequestCommand>
{
    public CreateTransportRequestCommandValidator()
    {
        RuleFor(v => v.RequesterId)
            .NotEmpty().WithMessage("Requester ID is required.");

        RuleFor(v => v.ScheduledTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Scheduled time must be in the future.");

        RuleFor(v => v.PickupAddress)
            .NotEmpty().WithMessage("Pickup address is required.")
            .MaximumLength(500).WithMessage("Pickup address must not exceed 500 characters.");

        RuleFor(v => v.PickupLat)
            .InclusiveBetween(-90, 90).WithMessage("Pickup latitude must be between -90 and 90.");

        RuleFor(v => v.PickupLng)
            .InclusiveBetween(-180, 180).WithMessage("Pickup longitude must be between -180 and 180.");

        RuleFor(v => v.PickupDivision)
            .NotEmpty().WithMessage("Pickup Division is required.");

        RuleFor(v => v.PickupDistrict)
            .NotEmpty().WithMessage("Pickup District is required.");

        RuleFor(v => v.PickupThana)
            .NotEmpty().WithMessage("Pickup Thana is required.");

        RuleFor(v => v.DropAddress)
            .NotEmpty().WithMessage("Drop address is required.")
            .MaximumLength(500).WithMessage("Drop address must not exceed 500 characters.");

        RuleFor(v => v.DropLat)
            .InclusiveBetween(-90, 90).WithMessage("Drop latitude must be between -90 and 90.");

        RuleFor(v => v.DropLng)
            .InclusiveBetween(-180, 180).WithMessage("Drop longitude must be between -180 and 180.");

        RuleFor(v => v.DropDivision)
            .NotEmpty().WithMessage("Drop Division is required.");

        RuleFor(v => v.DropDistrict)
            .NotEmpty().WithMessage("Drop District is required.");

        RuleFor(v => v.DropThana)
            .NotEmpty().WithMessage("Drop Thana is required.");

        RuleFor(v => v.GoodsType)
            .NotEmpty().WithMessage("Goods type is required.")
            .MaximumLength(100).WithMessage("Goods type must not exceed 100 characters.");

        RuleFor(v => v.WeightKg)
            .GreaterThan(0).WithMessage("Weight must be greater than 0.");
    }
}
