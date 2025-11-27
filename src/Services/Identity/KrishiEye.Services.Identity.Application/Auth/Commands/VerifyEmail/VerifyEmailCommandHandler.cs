using KrishiEye.Services.Identity.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.VerifyEmail;

public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, VerifyEmailResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<VerifyEmailCommandHandler> _logger;

    public VerifyEmailCommandHandler(
        UserManager<ApplicationUser> userManager,
        ILogger<VerifyEmailCommandHandler> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<VerifyEmailResponse> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        if (user.EmailConfirmed)
        {
            return new VerifyEmailResponse
            {
                Message = "Email already verified",
                IsVerified = true
            };
        }

        if (string.IsNullOrEmpty(user.EmailVerificationCode))
        {
            throw new InvalidOperationException("No verification code found. Please request a new code.");
        }

        if (user.EmailVerificationCodeExpiry < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Verification code expired. Please request a new code.");
        }

        if (user.EmailVerificationCode != request.Code)
        {
            throw new InvalidOperationException("Invalid verification code");
        }

        // Mark email as confirmed
        user.EmailConfirmed = true;
        user.EmailVerificationCode = null;
        user.EmailVerificationCodeExpiry = null;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Email verified for user {Email}", user.Email);

        return new VerifyEmailResponse
        {
            Message = "Email verified successfully",
            IsVerified = true
        };
    }
}
