using MediatR;
using KrishiEye.Services.Media.API.Services;

namespace KrishiEye.Services.Media.API.Features.Files.DeleteFile;

public record DeleteFileCommand(string FileUrl) : IRequest;

public class DeleteFileCommandHandler : IRequestHandler<DeleteFileCommand>
{
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<DeleteFileCommandHandler> _logger;

    public DeleteFileCommandHandler(IFileStorageService fileStorageService, ILogger<DeleteFileCommandHandler> logger)
    {
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task Handle(DeleteFileCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.FileUrl))
        {
            throw new ArgumentException("File URL is required.");
        }

        try
        {
            await _fileStorageService.DeleteFileAsync(request.FileUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling DeleteFileCommand");
            throw;
        }
    }
}
