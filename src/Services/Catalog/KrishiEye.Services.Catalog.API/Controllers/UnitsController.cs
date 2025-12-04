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
    public class UnitsController : ControllerBase
    {
        private readonly CatalogDbContext _context;

        public UnitsController(CatalogDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/units")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<MeasurementUnit>>> GetUnits()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var ownerId = Guid.Parse(userId);

            // Return Global units + User's own units
            return await _context.MeasurementUnits
                .Where(u => u.IsGlobal || u.OwnerId == ownerId)
                .ToListAsync();
        }

        [HttpPost("user/units")]
        [Authorize]
        public async Task<ActionResult<MeasurementUnit>> CreateUnit(MeasurementUnit unit)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            unit.OwnerId = Guid.Parse(userId);
            unit.IsGlobal = false;

            _context.MeasurementUnits.Add(unit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUnits), new { id = unit.Id }, unit);
        }
    }
}
