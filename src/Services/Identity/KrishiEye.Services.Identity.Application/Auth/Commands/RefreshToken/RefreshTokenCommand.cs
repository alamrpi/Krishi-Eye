using MediatR;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.RefreshToken;

/// <summary>
/// Command to refresh access token using refresh token
/// </summary>
public class RefreshTokenCommand : IRequest<RefreshTokenResponse>
{
    public string RefreshToken { get; set; } = string.Empty;
}
