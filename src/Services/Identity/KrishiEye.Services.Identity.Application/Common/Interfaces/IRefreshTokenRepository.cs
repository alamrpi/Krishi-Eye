using KrishiEye.Services.Identity.Domain.Entities;

namespace KrishiEye.Services.Identity.Application.Common.Interfaces;

/// <summary>
/// Repository for refresh token operations
/// </summary>
public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default);
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    Task RevokeAsync(string token, CancellationToken cancellationToken = default);
    Task RevokeAllForUserAsync(Guid userId, CancellationToken cancellationToken = default);
}
