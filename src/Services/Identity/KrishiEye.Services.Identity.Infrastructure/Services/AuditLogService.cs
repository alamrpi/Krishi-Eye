using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using KrishiEye.Services.Identity.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Identity.Infrastructure.Services;

/// <summary>
/// Audit logging service implementation
/// </summary>
public class AuditLogService : IAuditLogService
{
    private readonly IdentityDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditLogService(IdentityDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(string action, string entityType, string? entityId = null, string? details = null, Guid? userId = null)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details,
            IpAddress = httpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = httpContext?.Request.Headers["User-Agent"].ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }

    public async Task<List<AuditLog>> GetLogsAsync(Guid? userId = null, string? action = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);

        if (!string.IsNullOrEmpty(action))
            query = query.Where(l => l.Action == action);

        if (from.HasValue)
            query = query.Where(l => l.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(l => l.CreatedAt <= to.Value);

        return await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(l => l.User)
            .ToListAsync();
    }
}
