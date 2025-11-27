using KrishiEye.Services.Identity.Domain.Constants;
using KrishiEye.Services.Identity.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Identity.Infrastructure.Data;

/// <summary>
/// Seeds initial roles and admin user
/// </summary>
public class IdentityDbInitializer
{
    private readonly IdentityDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly ILogger<IdentityDbInitializer> _logger;

    public IdentityDbInitializer(
        IdentityDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        ILogger<IdentityDbInitializer> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        try
        {
            // Create database if it doesn't exist
            if (_context.Database.GetPendingMigrations().Any())
            {
                _logger.LogInformation("Applying pending migrations...");
                await _context.Database.MigrateAsync();
            }

            // Seed roles
            await SeedRolesAsync();

            // Seed admin user
            await SeedAdminUserAsync();

            _logger.LogInformation("Database initialization completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database");
            throw;
        }
    }

    private async Task SeedRolesAsync()
    {
        foreach (var roleName in Roles.All)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                var role = new IdentityRole<Guid>
                {
                    Id = Guid.NewGuid(),
                    Name = roleName,
                    NormalizedName = roleName.ToUpper()
                };

                var result = await _roleManager.CreateAsync(role);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Created role: {RoleName}", roleName);
                }
                else
                {
                    _logger.LogWarning("Failed to create role {RoleName}: {Errors}",
                        roleName, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    private async Task SeedAdminUserAsync()
    {
        const string adminEmail = "admin@krishieye.com";
        const string adminPassword = "Admin@123";

        var existingAdmin = await _userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, Roles.Admin);
                _logger.LogInformation("Created admin user: {Email}", adminEmail);
            }
            else
            {
                _logger.LogWarning("Failed to create admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}
