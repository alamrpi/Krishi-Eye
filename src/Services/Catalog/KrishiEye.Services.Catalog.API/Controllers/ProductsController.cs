using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KrishiEye.Services.Catalog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly CatalogDbContext _context;

        public ProductsController(CatalogDbContext context)
        {
            _context = context;
        }

        // Public Listing (Published Only)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.MeasurementUnit)
                .Where(p => p.IsPublished && p.IsActive)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.MeasurementUnit)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            // If not published, only owner can see
            if (!product.IsPublished)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || product.OwnerId.ToString() != userId)
                {
                    return NotFound();
                }
            }

            return product;
        }

        // User Management Endpoints
        [HttpGet("user/products")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Product>>> GetUserProducts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var ownerId = Guid.Parse(userId);

            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.MeasurementUnit)
                .Where(p => p.OwnerId == ownerId && p.IsActive)
                .ToListAsync();
        }

        [HttpPost("user/products")]
        [Authorize]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            product.OwnerId = Guid.Parse(userId);
            product.IsPublished = false; // Draft by default
            product.IsActive = true;
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPatch("user/products/{id}/publish")]
        [Authorize]
        public async Task<IActionResult> PublishProduct(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (product.OwnerId.ToString() != userId) return Forbid();

            product.IsPublished = true;
            product.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("user/products/{id}/unpublish")]
        [Authorize]
        public async Task<IActionResult> UnpublishProduct(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (product.OwnerId.ToString() != userId) return Forbid();

            product.IsPublished = false;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("user/products/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(Guid id, Product product)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (id != product.Id) return BadRequest();

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return NotFound();

            if (existingProduct.OwnerId.ToString() != userId) return Forbid();

            existingProduct.Title = product.Title;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.UnitId = product.UnitId;
            existingProduct.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("user/products/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (product.OwnerId.ToString() != userId) return Forbid();

            // Soft delete
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(Guid id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
