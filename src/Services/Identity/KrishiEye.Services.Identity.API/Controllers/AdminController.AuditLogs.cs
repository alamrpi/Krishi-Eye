using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiEye.Services.Identity.API.Controllers;

public partial class AdminController
{
    private readonly IAuditLogService _auditLogService;

    /// <summary>
    /// Get audit logs
    /// </summary>
    [HttpGet("audit-logs")]
    [ProducesResponseType(typeof(AuditLogResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] Guid? userId = null,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var logs = await _auditLogService.GetLogsAsync(userId, action, from, to, page, pageSize);

        var response = new AuditLogResponse
        {
            Logs = logs.Select(l => new AuditLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                UserEmail = l.User?.Email,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                Details = l.Details,
                IpAddress = l.IpAddress,
                UserAgent = l.UserAgent,
                CreatedAt = l.CreatedAt
            }).ToList(),
            Page = page,
            PageSize = pageSize
        };

        return Ok(response);
    }
}

public class AuditLogDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuditLogResponse
{
    public List<AuditLogDto> Logs { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
}
