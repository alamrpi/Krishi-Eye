using MediatR;
using KrishiEye.Services.Media.API.Features.Files.UploadFile;
using KrishiEye.Services.Media.API.Features.Files.DeleteFile;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Media.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IMediator mediator, ILogger<FilesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        try
        {
            var fileUrl = await _mediator.Send(new UploadFileCommand(file));
            return Ok(new { Url = fileUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File upload failed");
            return StatusCode(500, "Internal server error during file upload.");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteFile([FromQuery] string fileUrl)
    {
        try
        {
            await _mediator.Send(new DeleteFileCommand(fileUrl));
            return Ok(new { Message = "File deleted successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File deletion failed");
            return StatusCode(500, "Internal server error during file deletion.");
        }
    }
}
