using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.Bids.Commands.SubmitBid;

public class SubmitBidCommandValidator : AbstractValidator<SubmitBidCommand>
{
    public SubmitBidCommandValidator()
    {
        RuleFor(v => v.RequestId)
            .NotEmpty().WithMessage("Request ID is required.");

        RuleFor(v => v.BidAmount)
            .GreaterThan(0).WithMessage("Bid amount must be greater than 0.")
            .LessThanOrEqualTo(1000000).WithMessage("Bid amount must not exceed 1,000,000 BDT.");

        RuleFor(v => v.Note)
            .MaximumLength(500).When(v => !string.IsNullOrEmpty(v.Note))
            .WithMessage("Note must not exceed 500 characters.");
    }
}
