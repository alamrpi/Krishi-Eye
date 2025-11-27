using KrishiEye.Services.Identity.Domain.Entities;

namespace KrishiEye.Services.Identity.Application.Common.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Generate access token for authenticated user
    /// </summary>
    string GenerateAccessToken(ApplicationUser user, IList<string> roles, IList<string> permissions);
    
    /// <summary>
    /// Generate refresh token
    /// </summary>
    RefreshToken GenerateRefreshToken(Guid userId);
    
    /// <summary>
    /// Validate token and extract user ID
    /// </summary>
    Guid? ValidateToken(string token);
}
