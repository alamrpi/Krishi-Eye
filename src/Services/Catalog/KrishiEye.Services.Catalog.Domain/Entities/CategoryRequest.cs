using System;

namespace KrishiEye.Services.Catalog.Domain.Entities
{
    public class CategoryRequest
    {
        public Guid Id { get; set; }
        public string RequestedCategoryName { get; set; } = string.Empty;
        public Guid RequestedByUserId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public string? AdminComments { get; set; }
    }

    public enum RequestStatus
    {
        Pending,
        Approved,
        Rejected
    }
}
