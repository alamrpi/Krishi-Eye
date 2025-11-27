using KrishiEye.Services.Transport.Application.Features.TransportRequests.Commands.CreateTransportRequest;
using KrishiEye.Services.Transport.Application.Features.TransportRequests.Queries.GetRequestDetails;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportRequestsController : ControllerBase
{
    private readonly ISender _sender;

    public TransportRequestsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Guid>> CreateRequest(CreateTransportRequestCommand command)
    {
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpGet("{requestId}")]
    public async Task<ActionResult> GetRequestDetails(Guid requestId)
    {
        var query = new GetRequestDetailsQuery { RequestId = requestId };
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }
}
