using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.CreateTransporterProfile;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddDriver;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.UpdateDriver;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.DeleteDriver;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.AddVehicle;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.UpdateVehicle;
using KrishiEye.Services.Transport.Application.Features.Transporters.Commands.DeleteVehicle;
using KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetDrivers;
using KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetVehicles;
using KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetNearbyRequests;
using KrishiEye.Services.Transport.Application.Features.Transporters.Queries.GetEarningsReport;
using KrishiEye.Services.Transport.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Transport.API.Controllers;

[ApiController]
[Route("api/transport/transporters")]
public class TransportersController : ControllerBase
{
    private readonly ISender _sender;

    public TransportersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("profile")]
    [Authorize] // Any authenticated user can create a profile to become a transporter
    public async Task<ActionResult<Guid>> CreateProfile(CreateTransporterProfileCommand command)
    {
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    // Driver Management
    [HttpGet("drivers")]
    [Authorize]
    public async Task<ActionResult> GetDrivers()
    {
        var query = new GetDriversQuery();
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPost("drivers")]
    [Authorize]
    public async Task<ActionResult<Guid>> AddDriver(AddDriverCommand command)
    {
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPut("drivers/{id}")]
    [Authorize]
    public async Task<ActionResult> UpdateDriver(Guid id, UpdateDriverCommand command)
    {
        if (id != command.DriverId)
        {
            return BadRequest("Driver ID mismatch");
        }

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpDelete("drivers/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteDriver(Guid id)
    {
        var command = new DeleteDriverCommand { DriverId = id };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    // Vehicle Management
    [HttpGet("vehicles")]
    [Authorize]
    public async Task<ActionResult> GetVehicles()
    {
        var query = new GetVehiclesQuery();
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPost("vehicles")]
    [Authorize]
    public async Task<ActionResult<Guid>> AddVehicle(AddVehicleCommand command)
    {
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpPut("vehicles/{id}")]
    [Authorize]
    public async Task<ActionResult> UpdateVehicle(Guid id, UpdateVehicleCommand command)
    {
        if (id != command.VehicleId)
        {
            return BadRequest("Vehicle ID mismatch");
        }

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpDelete("vehicles/{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteVehicle(Guid id)
    {
        var command = new DeleteVehicleCommand { VehicleId = id };
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpGet("nearby-requests")]
    [Authorize]
    public async Task<ActionResult> GetNearbyRequests([FromQuery] int radiusKm = 50)
    {
        var query = new GetNearbyRequestsQuery { RadiusKm = radiusKm };
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpGet("earnings-report")]
    [Authorize]
    public async Task<ActionResult> GetEarningsReport()
    {
        var query = new GetEarningsReportQuery();
        var result = await _sender.Send(query);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }
}
