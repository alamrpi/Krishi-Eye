using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.SendVerificationEmail;

public class SendVerificationEmailCommandHandler : IRequestHandler<SendVerificationEmailCommand, SendVerificationEmailResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly ILogger<SendVerificationEmailCommandHandler> _logger;

    public SendVerificationEmailCommandHandler(
        UserManager<ApplicationUser> userManager,
        IEmailService emailService,
        ILogger<SendVerificationEmailCommandHandler> logger)
    {
        _userManager = userManager;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<SendVerificationEmailResponse> Handle(SendVerificationEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        if (user.EmailConfirmed)
        {
            throw new InvalidOperationException("Email already verified");
        }

        // Generate 6-digit code
        var code = new Random().Next(100000, 999999).ToString();
        var expiresAt = DateTime.UtcNow.AddHours(24);

        user.EmailVerificationCode = code;
        user.EmailVerificationCodeExpiry = expiresAt;
        await _userManager.UpdateAsync(user);

        // Send email
        await _emailService.SendVerificationEmailAsync(user.Email!, code, $"{user.FirstName} {user.LastName}");

        _logger.LogInformation("Verification email sent to {Email}", user.Email);

        return new SendVerificationEmailResponse
        {
            Message = "Verification code sent to your email",
            ExpiresAt = expiresAt
        };
    }
}
