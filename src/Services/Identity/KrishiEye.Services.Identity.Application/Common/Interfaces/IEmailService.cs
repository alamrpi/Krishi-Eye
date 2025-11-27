namespace KrishiEye.Services.Identity.Application.Common.Interfaces;

/// <summary>
/// Email service for sending verification, password reset, and notification emails
/// </summary>
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlBody);
    Task SendVerificationEmailAsync(string email, string code, string userName);
    Task SendPasswordResetEmailAsync(string email, string resetToken);
    Task SendWelcomeEmailAsync(string email, string userName, string temporaryPassword);
    Task Send2FACodeAsync(string email, string code);
}
