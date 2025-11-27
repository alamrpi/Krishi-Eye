using KrishiEye.Services.Transport.Application.Features.Jobs.Commands.StartTransit;
using KrishiEye.Services.Transport.Application.Features.Jobs.Commands.CompleteDelivery;
using KrishiEye.Services.Transport.Application.Features.Jobs.Commands.UpdateLocation;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/transport/jobs")]
public class JobsController : ControllerBase
{
    private readonly ISender _sender;

    public JobsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("{requestId}/start-transit")]
    [Authorize]
    public async Task<ActionResult<Guid>> StartTransit(Guid requestId)
    {
        var command = new StartTransitCommand { RequestId = requestId };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPost("{requestId}/complete")]
    [Authorize]
    public async Task<ActionResult<Guid>> CompleteDelivery(Guid requestId, [FromBody] CompleteDeliveryDto? dto = null)
    {
        var command = new CompleteDeliveryCommand 
        { 
            RequestId = requestId,
            MarkCashReceived = dto?.MarkCashReceived ?? true
        };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPost("{requestId}/location")]
    [Authorize]
    public async Task<ActionResult<bool>> UpdateLocation(Guid requestId, [FromBody] LocationUpdateDto dto)
    {
        var command = new UpdateLocationCommand 
        { 
            RequestId = requestId,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude
        };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }
}

public record LocationUpdateDto
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }
}

public record CompleteDeliveryDto
{
    public bool MarkCashReceived { get; init; } = true;
}
