using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KrishiEye.Services.Catalog.API.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CategoryRequestsController : ControllerBase
    {
        private readonly CatalogDbContext _context;

        public CategoryRequestsController(CatalogDbContext context)
        {
            _context = context;
        }

        [HttpPost("categories/request")]
        [Authorize]
        public async Task<ActionResult<CategoryRequest>> CreateRequest([FromBody] CreateCategoryRequestDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var request = new CategoryRequest
            {
                RequestedCategoryName = dto.Name,
                RequestedByUserId = Guid.Parse(userId),
                Status = RequestStatus.Pending,
                RequestDate = DateTime.UtcNow
            };

            _context.CategoryRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(request);
        }

        [HttpPost("admin/category-requests/{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveRequest(Guid id)
        {
            var request = await _context.CategoryRequests.FindAsync(id);
            if (request == null) return NotFound();

            if (request.Status != RequestStatus.Pending)
                return BadRequest("Request is not pending.");

            // Create the category
            var category = new Category
            {
                Name = request.RequestedCategoryName,
                Slug = request.RequestedCategoryName.ToLower().Replace(" ", "-"),
                Status = CategoryStatus.Active
            };

            _context.Categories.Add(category);
            
            // Update request status
            request.Status = RequestStatus.Approved;
            
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Category created and request approved.", CategoryId = category.Id });
        }
    }

    public class CreateCategoryRequestDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
