using KrishiEye.Services.Catalog.Application.Products.Commands.CreateProduct;
using KrishiEye.Services.Catalog.Application.Products.Commands.DeleteProduct;
using KrishiEye.Services.Catalog.Application.Products.Commands.UpdateProduct;
using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductById;
using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductBySlug;
using KrishiEye.Services.Catalog.Application.Products.Queries.GetProductsBySeller;
using KrishiEye.Services.Catalog.Application.Products.Queries.SearchProducts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Search and filter products
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<SearchProductsResult>> Search(
        [FromQuery] string? searchTerm,
        [FromQuery] Guid? categoryId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStockOnly,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 20)
    {
        var query = new SearchProductsQuery(searchTerm, categoryId, minPrice, maxPrice, inStockOnly, skip, take);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// Get product by URL slug (SEO-friendly)
    /// </summary>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ProductDto>> GetBySlug(string slug)
    {
        var result = await _mediator.Send(new GetProductBySlugQuery(slug));
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// Get all products by seller ID
    /// </summary>
    [HttpGet("seller/{sellerId}")]
    public async Task<ActionResult<List<ProductDto>>> GetBySeller(Guid sellerId)
    {
        var result = await _mediator.Send(new GetProductsBySellerQuery(sellerId));
        return Ok(result);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateProductCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        var command = new UpdateProductCommand(
            id,
            request.Name,
            request.Description,
            request.Price,
            request.Currency,
            request.StockQuantity,
            request.ImageUrl);

        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}

public record UpdateProductRequest(
    string Name,
    string Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    string? ImageUrl);
