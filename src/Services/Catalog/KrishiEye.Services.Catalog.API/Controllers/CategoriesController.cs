using KrishiEye.Services.Catalog.Application.Categories.Commands.CreateCategory;
using KrishiEye.Services.Catalog.Application.Categories.Commands.UpdateCategory;
using KrishiEye.Services.Catalog.Application.Categories.Commands.DeleteCategory;
using KrishiEye.Services.Catalog.Application.Categories.Queries.GetAllCategories;
using KrishiEye.Services.Catalog.Application.Categories.Queries.GetCategoryById;
using KrishiEye.Services.Catalog.Application.Categories.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll([FromQuery] Guid? productTypeId = null)
    {
        var result = await _mediator.Send(new GetAllCategoriesQuery(productTypeId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateCategoryCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetCategoryByIdQuery(id));
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        var command = new UpdateCategoryCommand(
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
        await _mediator.Send(new DeleteCategoryCommand(id));
        return NoContent();
    }
}

public record UpdateCategoryRequest(
    string Name,
    string Description,
    string UrlSlug,
    string MetaTitle,
    string MetaDescription);
