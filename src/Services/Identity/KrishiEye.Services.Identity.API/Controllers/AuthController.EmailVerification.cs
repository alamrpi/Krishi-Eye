using KrishiEye.Services.Identity.Application.Auth.Commands.SendVerificationEmail;
using KrishiEye.Services.Identity.Application.Auth.Commands.VerifyEmail;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class AuthController
{
    /// <summary>
    /// Send email verification code
    /// </summary>
    [HttpPost("send-verification-email")]
    [ProducesResponseType(typeof(SendVerificationEmailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SendVerificationEmail([FromBody] SendVerificationEmailCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending verification email");
            return StatusCode(500, new { error = "An error occurred" });
        }
    }

    /// <summary>
    /// Verify email with code
    /// </summary>
    [HttpPost("verify-email")]
    [ProducesResponseType(typeof(VerifyEmailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email");
            return StatusCode(500, new { error = "An error occurred" });
        }
    }
}
