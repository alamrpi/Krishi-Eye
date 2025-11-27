using MediatR;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.Register;

/// <summary>
/// Command to register a new user
/// </summary>
public class RegisterCommand : IRequest<RegisterResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
}
