using KrishiEye.Services.Identity.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace KrishiEye.Services.Identity.Infrastructure.Services;

/// <summary>
/// SMTP email service implementation
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var smtpUser = _configuration["Email:SmtpUser"];
        var smtpPass = _configuration["Email:SmtpPassword"];
        var fromEmail = _configuration["Email:FromEmail"];
        var fromName = _configuration["Email:FromName"];

        var client = new SmtpClient(smtpHost, smtpPort)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(smtpUser, smtpPass)
        };

        var message = new MailMessage
        {
            From = new MailAddress(fromEmail!, fromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        message.To.Add(to);

        try
        {
            await client.SendMailAsync(message);
            _logger.LogInformation("Email sent successfully to {Email}", to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", to);
            throw;
        }
    }

    public async Task SendVerificationEmailAsync(string email, string code, string userName)
    {
        var subject = "Verify Your Email - Krishi Eye";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Welcome to Krishi Eye, {userName}!</h2>
                <p>Please verify your email address by entering this code:</p>
                <h1 style='color: #4CAF50; letter-spacing: 5px;'>{code}</h1>
                <p>This code will expire in 24 hours.</p>
                <p>If you didn't create this account, please ignore this email.</p>
                <hr>
                <p style='color: #888; font-size: 12px;'>Krishi Eye - Agricultural Marketplace</p>
            </body>
            </html>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetToken)
    {
        var resetLink = $"https://krishieye.com/reset-password?token={resetToken}";
        var subject = "Reset Your Password - Krishi Eye";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below:</p>
                <a href='{resetLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;'>Reset Password</a>
                <p>Or copy this link: {resetLink}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr>
                <p style='color: #888; font-size: 12px;'>Krishi Eye - Agricultural Marketplace</p>
            </body>
            </html>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendWelcomeEmailAsync(string email, string userName, string temporaryPassword)
    {
        var subject = "Welcome to Krishi Eye - Your Account Details";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Welcome to Krishi Eye, {userName}!</h2>
                <p>Your account has been created by an administrator.</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Temporary Password:</strong> <code style='background-color: #f0f0f0; padding: 5px;'>{temporaryPassword}</code></p>
                <p style='color: red;'><strong>Important:</strong> Please change your password after logging in for the first time.</p>
                <a href='https://krishieye.com/login' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;'>Login Now</a>
                <hr>
                <p style='color: #888; font-size: 12px;'>Krishi Eye - Agricultural Marketplace</p>
            </body>
            </html>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task Send2FACodeAsync(string email, string code)
    {
        var subject = "Your 2FA Code - Krishi Eye";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Two-Factor Authentication</h2>
                <p>Your verification code is:</p>
                <h1 style='color: #4CAF50; letter-spacing: 5px;'>{code}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't try to log in, please secure your account immediately.</p>
                <hr>
                <p style='color: #888; font-size: 12px;'>Krishi Eye - Agricultural Marketplace</p>
            </body>
            </html>";

        await SendEmailAsync(email, subject, body);
    }
}
