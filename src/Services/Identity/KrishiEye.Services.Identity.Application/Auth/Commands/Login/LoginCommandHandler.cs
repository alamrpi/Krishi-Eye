using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Constants;
using KrishiEye.Services.Identity.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.Login;

/// <summary>
/// Handler for user login with JWT token generation
/// </summary>
public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenService jwtTokenService,
        IRefreshTokenRepository refreshTokenRepository,
        ILogger<LoginCommandHandler> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _logger = logger;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Find user by email
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Login attempt with non-existent email: {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            _logger.LogWarning("Login attempt for inactive user: {Email}", request.Email);
            throw new UnauthorizedAccessException("Account is inactive");
        }

        // Verify password
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        
        if (result.IsLockedOut)
        {
            _logger.LogWarning("User account locked out: {Email}", request.Email);
            throw new UnauthorizedAccessException("Account is locked due to multiple failed login attempts");
        }

        if (!result.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for user: {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "Buyer"; // Default to Buyer if no role

        // Get permissions for role
        var permissions = Permissions.GetPermissionsForRole(userRole);

        // Generate JWT access token
        var accessToken = _jwtTokenService.GenerateAccessToken(user, roles, permissions);

        // Generate refresh token
        var refreshToken = _jwtTokenService.GenerateRefreshToken(user.Id);
        
        // Save refresh token to database
        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);

        // Update last login time
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Successful login for user: {Email}", request.Email);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresIn = 900, // 15 minutes in seconds
            TokenType = "Bearer",
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = userRole,
                Permissions = permissions
            }
        };
    }
}
