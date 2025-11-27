using KrishiEye.Services.Transport.Application.Features.Bids.Commands.SubmitBid;
using KrishiEye.Services.Transport.Application.Features.Bids.Commands.AcceptBid;
using KrishiEye.Services.Transport.Application.Features.Bids.Queries.GetMyBids;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/transport/bids")]
public class BidsController : ControllerBase
{
    private readonly ISender _sender;

    public BidsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    [Authorize] // Transporters only
    public async Task<ActionResult<Guid>> SubmitBid(SubmitBidCommand command)
    {
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPost("{bidId}/accept")]
    [Authorize] // Requesters only
    public async Task<ActionResult<Guid>> AcceptBid(Guid bidId)
    {
        var command = new AcceptBidCommand { BidId = bidId };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpGet("my-bids")]
    [Authorize] // Transporters only
    public async Task<ActionResult> GetMyBids()
    {
        var query = new GetMyBidsQuery();
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }
}
