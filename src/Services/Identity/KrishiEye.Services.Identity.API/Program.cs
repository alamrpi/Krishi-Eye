using KrishiEye.Services.Identity.Application.Common.Interfaces;
using KrishiEye.Services.Identity.Domain.Entities;
using KrishiEye.Services.Identity.Infrastructure.Data;
using KrishiEye.Services.Identity.Infrastructure.Repositories;
using KrishiEye.Services.Identity.Infrastructure.Services;
using KrishiEye.Services.Identity.Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAdminUI",
        builder => builder
            .SetIsOriginAllowed(origin => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// MediatR and FluentValidation
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(
    typeof(KrishiEye.Services.Identity.Application.Auth.Commands.Register.RegisterCommand).Assembly));

// Database
var connectionString = builder.Configuration.GetConnectionString("IdentityConnection");
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions => 
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));

// ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<IdentityDbContext>()
.AddDefaultTokenProviders();

// JWT Settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// JWT Token Service
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

// Repositories  
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

// Audit Logging
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();

// Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

// Database Initializer
builder.Services.AddScoped<IdentityDbInitializer>();

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<IdentityDbInitializer>();
    await initializer.InitializeAsync();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAdminUI");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
