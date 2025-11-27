using MediatR;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.Login;

/// <summary>
/// Command to authenticate user and generate JWT token
/// </summary>
public class LoginCommand : IRequest<LoginResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
