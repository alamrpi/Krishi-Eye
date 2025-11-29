using MediatR;
using Microsoft.AspNetCore.Http;

namespace KrishiEye.Services.Transport.Application.Features.Files.Commands.UploadFile
{
    public record UploadFileCommand(IFormFile File) : IRequest<string>;
}
