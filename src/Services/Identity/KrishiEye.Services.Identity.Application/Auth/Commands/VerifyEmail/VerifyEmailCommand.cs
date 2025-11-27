using MediatR;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.VerifyEmail;

public class VerifyEmailCommand : IRequest<VerifyEmailResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class VerifyEmailResponse
{
    public string Message { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
}
