using FluentValidation;

namespace KrishiEye.Services.Transport.Application.Features.Bids.Commands.AcceptBid;

public class AcceptBidCommandValidator : AbstractValidator<AcceptBidCommand>
{
    public AcceptBidCommandValidator()
    {
        RuleFor(v => v.BidId)
            .NotEmpty().WithMessage("Bid ID is required.");
    }
}
