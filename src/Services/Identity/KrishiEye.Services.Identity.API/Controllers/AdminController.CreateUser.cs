using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Constants;
using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class AdminController
{
    /// <summary>
    /// Create new user (Admin only)
    /// </summary>
    [HttpPost("users/create")]
    [ProducesResponseType(typeof(CreateUserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request, [FromServices] IEmailService emailService)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { error = "User with this email already exists" });
        }

        // Generate temporary password
        var tempPassword = GenerateTemporaryPassword();

        // Create user
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            EmailConfirmed = true, // Admin-created users are auto-confirmed
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, tempPassword);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        // Assign role
        await _userManager.AddToRoleAsync(user, request.Role);

        // Add permissions
        var permissions = Permissions.GetPermissionsForRole(request.Role);
        foreach (var permission in permissions)
        {
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("permission", permission));
        }

        // Send welcome email
        if (request.SendWelcomeEmail)
        {
            await emailService.SendWelcomeEmailAsync(user.Email!, $"{user.FirstName} {user.LastName}", tempPassword);
        }

        _logger.LogInformation("User {Email} created by admin with role {Role}", user.Email, request.Role);

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new CreateUserResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            TemporaryPassword = request.SendWelcomeEmail ? null : tempPassword, // Only return if not emailed
            Message = request.SendWelcomeEmail ? "User created and welcome email sent" : "User created successfully"
        });
    }

    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        var random = new Random();
        var password = new char[12];
        
        password[0] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[random.Next(26)]; // Uppercase
        password[1] = "abcdefghijklmnopqrstuvwxyz"[random.Next(26)]; // Lowercase
        password[2] = "0123456789"[random.Next(10)]; // Digit
        password[3] = "!@#$%^&*"[random.Next(8)]; // Special char
        
        for (int i = 4; i < 12; i++)
        {
            password[i] = chars[random.Next(chars.Length)];
        }
        
        return new string(password.OrderBy(x => random.Next()).ToArray());
    }
}

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool SendWelcomeEmail { get; set; } = true;
}

public class CreateUserResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? TemporaryPassword { get; set; }
    public string Message { get; set; } = string.Empty;
}
