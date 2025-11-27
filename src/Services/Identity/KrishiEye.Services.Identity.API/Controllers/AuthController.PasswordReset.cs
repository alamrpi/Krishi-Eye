using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class AuthController
{
    /// <summary>
    /// Request password reset
    /// </summary>
    [HttpPost("request-password-reset")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetRequest request, [FromServices] UserManager<ApplicationUser> userManager, [FromServices] IEmailService emailService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            // Don't reveal that the user doesn't exist
            return Ok(new { message = "If your email is registered, you will receive a password reset link" });
        }

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        
        // In production, encode the token for URL
        await emailService.SendPasswordResetEmailAsync(user.Email!, resetToken);

        _logger.LogInformation("Password reset requested for {Email}", user.Email);

        return Ok(new { message = "If your email is registered, you will receive a password reset link" });
    }

    /// <summary>
    /// Reset password with token
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, [FromServices] UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest(new { error = "Invalid request" });
        }

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        _logger.LogInformation("Password reset successful for {Email}", user.Email);

        return Ok(new { message = "Password reset successfully" });
    }
}

public class RequestPasswordResetRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
