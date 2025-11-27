using Microsoft.AspNetCore.Identity;

namespace KrishiEye.Services.Identity.Domain.Entities;

/// <summary>
/// Application user entity extending ASP.NET Core Identity
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    
    // Email Verification
    public string? EmailVerificationCode { get; set; }
    public DateTime? EmailVerificationCodeExpiry { get; set; }
    
    // Two-Factor Authentication
    public bool TwoFactorEnabled { get; set; } = false;
    public string? TwoFactorSecret { get; set; }
    
    // Navigation properties
    public virtual ICollection<IdentityUserRole<Guid>> UserRoles { get; set; } = new List<IdentityUserRole<Guid>>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
