using KrishiEye.Services.Catalog.Application.ProductTypes.Commands.CreateProductType;
using KrishiEye.Services.Catalog.Application.ProductTypes.Commands.DeleteProductType;
using KrishiEye.Services.Catalog.Application.ProductTypes.Commands.UpdateProductType;
using KrishiEye.Services.Catalog.Application.ProductTypes.Queries.GetAllProductTypes;
using KrishiEye.Services.Catalog.Application.ProductTypes.Queries.GetProductTypeById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductTypesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductTypesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductTypeDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllProductTypesQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductTypeDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProductTypeByIdQuery(id));
        if (result == null)
            return NotFound();
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateProductTypeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductTypeRequest request)
    {
        var command = new UpdateProductTypeCommand(
            id,
            request.Name,
            request.Description,
            request.UrlSlug,
            request.MetaTitle,
            request.MetaDescription);

        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteProductTypeCommand(id));
        return NoContent();
    }
}

public record UpdateProductTypeRequest(
    string Name,
    string Description,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription);
