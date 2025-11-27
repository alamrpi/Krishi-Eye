namespace KrishiEye.Services.Identity.Domain.Constants;

/// <summary>
/// Granular permissions for claims-based authorization
/// </summary>
public static class Permissions
{
    // Product Permissions
    public const string ProductCreate = "product.create";
    public const string ProductRead = "product.read";
    public const string ProductUpdate = "product.update";
    public const string ProductDelete = "product.delete";
    
    // Order Permissions
    public const string OrderCreate = "order.create";
    public const string OrderRead = "order.read";
    public const string OrderUpdate = "order.update";
    public const string OrderCancel = "order.cancel";
    
    // Vehicle Permissions
    public const string VehicleManage = "vehicle.manage";
    
    // Service Permissions
    public const string ServiceManage = "service.manage";
    
    // Admin Permissions
    public const string UserManage = "user.manage";
    public const string RoleManage = "role.manage";
    public const string SystemManage = "system.manage";
    
    /// <summary>
    /// Get permissions for a specific role
    /// </summary>
    public static List<string> GetPermissionsForRole(string role)
    {
        return role switch
        {
            Roles.Trader => new List<string>
            {
                ProductCreate, ProductRead, ProductUpdate, ProductDelete,
                OrderCreate, OrderRead, OrderUpdate, OrderCancel
            },
            Roles.Seller => new List<string>
            {
                ProductCreate, ProductRead, ProductUpdate, ProductDelete
            },
            Roles.Buyer => new List<string>
            {
                ProductRead,
                OrderCreate, OrderRead, OrderCancel
            },
            Roles.Transporter => new List<string>
            {
                VehicleManage,
                OrderRead
            },
            Roles.ServiceProvider => new List<string>
            {
                ServiceManage
            },
            Roles.Admin => new List<string>
            {
                ProductCreate, ProductRead, ProductUpdate, ProductDelete,
                OrderCreate, OrderRead, OrderUpdate, OrderCancel,
                VehicleManage, ServiceManage,
                UserManage, RoleManage, SystemManage
            },
            _ => new List<string>()
        };
    }
}
