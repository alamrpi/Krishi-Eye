using KrishiEye.Services.Transport.Application.Features.TransportRequests.Commands.CreateTransportRequest;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransportRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateTransportRequestCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}
