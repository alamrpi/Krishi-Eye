using MediatR;
using KrishiEye.Services.Media.API.Services;

namespace KrishiEye.Services.Media.API.Features.Files.UploadFile;

public record UploadFileCommand(IFormFile File) : IRequest<string>;

public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, string>
{
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<UploadFileCommandHandler> _logger;

    public UploadFileCommandHandler(IFileStorageService fileStorageService, ILogger<UploadFileCommandHandler> logger)
    {
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<string> Handle(UploadFileCommand request, CancellationToken cancellationToken)
    {
        if (request.File == null || request.File.Length == 0)
        {
            throw new ArgumentException("No file uploaded.");
        }

        try
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.File.FileName)}";
            using var stream = request.File.OpenReadStream();
            
            return await _fileStorageService.UploadFileAsync(stream, fileName, request.File.ContentType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling UploadFileCommand");
            throw;
        }
    }
}
