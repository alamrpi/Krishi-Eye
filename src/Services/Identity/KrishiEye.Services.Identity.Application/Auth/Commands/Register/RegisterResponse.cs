namespace KrishiEye.Services.Identity.Application.Auth.Commands.Register;

/// <summary>
/// Registration response DTO
/// </summary>
public class RegisterResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
