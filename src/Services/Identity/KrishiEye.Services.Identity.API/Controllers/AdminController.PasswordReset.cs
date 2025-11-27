using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class AdminController
{
    /// <summary>
    /// Force password reset for a user
    /// </summary>
    [HttpPost("users/{id}/reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ForcePasswordReset(Guid id, [FromBody] ForcePasswordResetRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        // Remove current password and set new one
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new { error = "Failed to reset password", errors = result.Errors.Select(e => e.Description) });
        }

        // Force user to change password on next login if requested
        if (request.RequirePasswordChange)
        {
            // This would be implemented with a custom claim or user property
            // For now, just log it
        }

        _logger.LogInformation("Password reset forced for user {Email} by admin", user.Email);
        
        return Ok(new { message = "Password reset successfully" });
    }
}

public class ForcePasswordResetRequest
{
    public string NewPassword { get; set; } = string.Empty;
    public bool RequirePasswordChange { get; set; } = false;
}
