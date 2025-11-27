using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Constants;
using KrishiEye.Services.Identity.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.RefreshToken;

/// <summary>
/// Handler for refreshing access token
/// </summary>
public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        UserManager<ApplicationUser> userManager,
        IJwtTokenService _jwtTokenService,
        IRefreshTokenRepository refreshTokenRepository,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _userManager = userManager;
        this._jwtTokenService = _jwtTokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _logger = logger;
    }

    public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Get refresh token from database
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);
        
        if (refreshToken == null || !refreshToken.IsActive)
        {
            _logger.LogWarning("Invalid or expired refresh token: {Token}", request.RefreshToken);
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        // Get user
        var user = await _userManager.FindByIdAsync(refreshToken.UserId.ToString());
        if (user == null || !user.IsActive)
        {
            _logger.LogWarning("User not found or inactive for refresh token: {UserId}", refreshToken.UserId);
            throw new UnauthorizedAccessException("User not found or inactive");
        }

        // Revoke old refresh token
        await _refreshTokenRepository.RevokeAsync(request.RefreshToken, cancellationToken);

        // Get user roles and permissions
        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault() ?? "Buyer";
        var permissions = Permissions.GetPermissionsForRole(userRole);

        // Generate new access token
        var newAccessToken = _jwtTokenService.GenerateAccessToken(user, roles, permissions);

        // Generate new refresh token (token rotation)
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken(user.Id);
        newRefreshToken.ReplacedByToken = request.RefreshToken;
        
        // Save new refresh token
        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);

        _logger.LogInformation("Token refreshed successfully for user: {Email}", user.Email);

        return new RefreshTokenResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresIn = 900, // 15 minutes
            TokenType = "Bearer"
        };
    }
}
