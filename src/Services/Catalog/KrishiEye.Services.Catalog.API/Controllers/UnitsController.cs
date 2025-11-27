using KrishiEye.Services.Catalog.Application.Units.Commands.CreateUnit;
using KrishiEye.Services.Catalog.Application.Units.Commands.UpdateUnit;
using KrishiEye.Services.Catalog.Application.Units.Commands.DeleteUnit;
using KrishiEye.Services.Catalog.Application.Units.Queries.GetAllUnits;
using KrishiEye.Services.Catalog.Application.Units.Queries.GetUnitById;
using KrishiEye.Services.Catalog.Application.Units.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitsController : ControllerBase
{
    private readonly IMediator _mediator;

    public UnitsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<UnitDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllUnitsQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateUnitCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UnitDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetUnitByIdQuery(id));
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUnitRequest request)
    {
        var command = new UpdateUnitCommand(
            id,
            request.Name,
            request.Symbol,
            (Domain.Entities.UnitType)request.UnitType);

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteUnitCommand(id));
        return NoContent();
    }
}

public record UpdateUnitRequest(
    string Name,
    string Symbol,
    int UnitType);
