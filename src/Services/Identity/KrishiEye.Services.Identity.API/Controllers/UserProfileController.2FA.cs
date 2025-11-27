using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class UserProfileController
{
    /// <summary>
    /// Enable 2FA and get QR code
    /// </summary>
    [HttpPost("enable-2fa")]
    [ProducesResponseType(typeof(Enable2FAResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Enable2FA([FromServices] UserManager<ApplicationUser> userManager)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        // Generate 2FA secret
        var secret = GenerateSecret();
        user.TwoFactorSecret = secret;
        user.TwoFactorEnabled = false; // Will be enabled after verification
        await userManager.UpdateAsync(user);

        // Generate QR code URL for authenticator apps
        var qrCodeUrl = GenerateQrCodeUrl(user.Email!, secret);

        return Ok(new Enable2FAResponse
        {
            Secret = secret,
            QrCodeUrl = qrCodeUrl,
            Message = "Scan the QR code with your authenticator app and verify the code to enable 2FA"
        });
    }

    /// <summary>
    /// Verify 2FA code and enable 2FA
    /// </summary>
    [HttpPost("verify-2fa")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Verify2FA([FromBody] Verify2FARequest request, [FromServices] UserManager<ApplicationUser> userManager)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.TwoFactorSecret))
        {
            return BadRequest(new { error = "2FA setup not initiated" });
        }

        // Verify TOTP code
        if (!VerifyTOTP(user.TwoFactorSecret, request.Code))
        {
            return BadRequest(new { error = "Invalid 2FA code" });
        }

        // Enable 2FA
        user.TwoFactorEnabled = true;
        await userManager.UpdateAsync(user);

        _logger.LogInformation("2FA enabled for user {Email}", user.Email);

        return Ok(new { message = "2FA enabled successfully" });
    }

    /// <summary>
    /// Disable 2FA
    /// </summary>
    [HttpPost("disable-2fa")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Disable2FA([FromServices] UserManager<ApplicationUser> userManager)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.TwoFactorEnabled = false;
        user.TwoFactorSecret = null;
        await userManager.UpdateAsync(user);

        _logger.LogInformation("2FA disabled for user {Email}", user.Email);

        return Ok(new { message = "2FA disabled successfully" });
    }

    private string GenerateSecret()
    {
        var random = new Random();
        var bytes = new byte[20];
        random.NextBytes(bytes);
        return Convert.ToBase64String(bytes).Replace("+", "").Replace("/", "").Replace("=", "").Substring(0, 16);
    }

    private string GenerateQrCodeUrl(string email, string secret)
    {
        var issuer = "KrishiEye";
        var label = $"{issuer}:{email}";
        return $"otpauth://totp/{Uri.EscapeDataString(label)}?secret={secret}&issuer={Uri.EscapeDataString(issuer)}";
    }

    private bool VerifyTOTP(string secret, string code)
    {
        // Simple TOTP verification (30-second window)
        var unixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var timeStep = unixTime / 30;

        for (int i = -1; i <= 1; i++) // Allow 1 step before and after
        {
            if (GenerateTOTP(secret, timeStep + i) == code)
            {
                return true;
            }
        }

        return false;
    }

    private string GenerateTOTP(string secret, long timeStep)
    {
        var key = Encoding.UTF8.GetBytes(secret);
        var counter = BitConverter.GetBytes(timeStep);
        if (BitConverter.IsLittleEndian)
            Array.Reverse(counter);

        using var hmac = new System.Security.Cryptography.HMACSHA1(key);
        var hash = hmac.ComputeHash(counter);
        var offset = hash[hash.Length - 1] & 0x0F;
        var binary = ((hash[offset] & 0x7F) << 24)
                   | ((hash[offset + 1] & 0xFF) << 16)
                   | ((hash[offset + 2] & 0xFF) << 8)
                   | (hash[offset + 3] & 0xFF);

        var otp = binary % 1000000;
        return otp.ToString("D6");
    }
}

public class Enable2FAResponse
{
    public string Secret { get; set; } = string.Empty;
    public string QrCodeUrl { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class Verify2FARequest
{
    public string Code { get; set; } = string.Empty;
}
