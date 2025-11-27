namespace KrishiEye.Services.Identity.Domain.Constants;

/// <summary>
/// Application roles - corresponding to user types
/// </summary>
public static class Roles
{
    public const string Trader = "Trader";
    public const string Seller = "Seller";
    public const string Buyer = "Buyer";
    public const string Transporter = "Transporter";
    public const string ServiceProvider = "ServiceProvider";
    public const string Admin = "Admin";
    
    public static readonly string[] All = 
    {
        Trader,
        Seller,
        Buyer,
        Transporter,
        ServiceProvider,
        Admin
    };
}
