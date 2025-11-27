using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Identity.API.Controllers;

/// <summary>
/// Admin endpoints for user management
/// </summary>
[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public partial class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        UserManager<ApplicationUser> userManager,
        IAuditLogService auditLogService,
        ILogger<AdminController> logger)
    {
        _userManager = userManager;
        _auditLogService = auditLogService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users with optional filtering
    /// </summary>
    [HttpGet("users")]
    [ProducesResponseType(typeof(UserListResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? role = null,
        [FromQuery] bool? isActive = null)
    {
        var query = _userManager.Users.AsQueryable();

        // Filter by active status
        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Pagination
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                IsActive = u.IsActive,
                EmailConfirmed = u.EmailConfirmed,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt
            })
            .ToListAsync();

        // Get roles for each user (if role filter specified)
        if (!string.IsNullOrEmpty(role))
        {
            var filteredUsers = new List<UserDto>();
            foreach (var user in users)
            {
                var userEntity = await _userManager.FindByIdAsync(user.Id.ToString());
                if (userEntity != null)
                {
                    var roles = await _userManager.GetRolesAsync(userEntity);
                    if (roles.Contains(role))
                    {
                        user.Role = role;
                        filteredUsers.Add(user);
                    }
                }
            }
            users = filteredUsers;
        }

        return Ok(new UserListResponse
        {
            Users = users,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("users/{id}")]
    [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserDetailDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            IsActive = user.IsActive,
            EmailConfirmed = user.EmailConfirmed,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            LastLoginAt = user.LastLoginAt,
            Roles = roles.ToList()
        });
    }

    /// <summary>
    /// Block/suspend a user
    /// </summary>
    [HttpPost("users/{id}/block")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> BlockUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { error = "Failed to block user" });
        }

        _logger.LogInformation("User {Email} blocked by admin", user.Email);
        return Ok(new { message = "User blocked successfully" });
    }

    /// <summary>
    /// Unblock a user
    /// </summary>
    [HttpPost("users/{id}/unblock")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnblockUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { error = "Failed to unblock user" });
        }

        _logger.LogInformation("User {Email} unblocked by admin", user.Email);
        return Ok(new { message = "User unblocked successfully" });
    }
}

// DTOs
public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
    public bool EmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class UserDetailDto : UserDto
{
    public DateTime UpdatedAt { get; set; }
    public List<string> Roles { get; set; } = new();
}

public class UserListResponse
{
    public List<UserDto> Users { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
