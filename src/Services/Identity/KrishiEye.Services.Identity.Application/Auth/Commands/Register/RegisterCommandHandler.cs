using KrishiEye.Services.Identity.Domain.Constants;
using KrishiEye.Services.Identity.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.Register;

/// <summary>
/// Handler for user registration
/// </summary>
public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        UserManager<ApplicationUser> userManager,
        ILogger<RegisterCommandHandler> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new user
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            EmailConfirmed = true, // Auto-confirm for now; can add email verification later
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Create user with password
        var result = await _userManager.CreateAsync(user, request.Password);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            _logger.LogWarning("Failed to create user {Email}: {Errors}", request.Email, errors);
            throw new InvalidOperationException($"Failed to create user: {errors}");
        }

        // Assign role
        var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
        if (!roleResult.Succeeded)
        {
            var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
            _logger.LogWarning("Failed to assign role {Role} to user {Email}: {Errors}", 
                request.Role, request.Email, errors);
        }

        // Add permissions as claims
        var permissions = Permissions.GetPermissionsForRole(request.Role);
        foreach (var permission in permissions)
        {
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("permission", permission));
        }

        _logger.LogInformation("Successfully registered user {Email} with role {Role}", request.Email, request.Role);

        return new RegisterResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = request.Role,
            Message = "Registration successful"
        };
    }
}
