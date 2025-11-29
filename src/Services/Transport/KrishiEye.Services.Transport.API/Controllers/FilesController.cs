using KrishiEye.Services.Transport.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/transport/files")]
public class FilesController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IFileStorageService fileStorageService, ILogger<FilesController> logger)
    {
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var fileUrl = await _fileStorageService.UploadFileAsync(stream, file.FileName, file.ContentType);
            return Ok(new { Url = fileUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File upload failed");
            return StatusCode(500, "Internal server error during file upload.");
        }
    }
}
