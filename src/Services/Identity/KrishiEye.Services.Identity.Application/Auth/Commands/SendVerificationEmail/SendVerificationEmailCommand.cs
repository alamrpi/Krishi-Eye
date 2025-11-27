using MediatR;

namespace KrishiEye.Services.Identity.Application.Auth.Commands.SendVerificationEmail;

public class SendVerificationEmailCommand : IRequest<SendVerificationEmailResponse>
{
    public string Email { get; set; } = string.Empty;
}

public class SendVerificationEmailResponse
{
    public string Message { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
