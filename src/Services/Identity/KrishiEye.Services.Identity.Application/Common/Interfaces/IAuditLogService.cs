using KrishiEye.Services.Identity.Domain.Entities;

namespace KrishiEye.Services.Identity.Application.Common.Interfaces;

/// <summary>
/// Service for audit logging
/// </summary>
public interface IAuditLogService
{
    Task LogAsync(string action, string entityType, string? entityId = null, string? details = null, Guid? userId = null);
    Task<List<AuditLog>> GetLogsAsync(Guid? userId = null, string? action = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50);
}
