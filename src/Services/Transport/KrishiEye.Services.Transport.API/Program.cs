using Microsoft.EntityFrameworkCore;
using KrishiEye.Services.Transport.Application;
using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Transport.API.Services;
using KrishiEye.Services.Transport.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddApplicationServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<TransportDbContext>());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext with PostgreSQL + PostGIS
builder.Services.AddDbContext<TransportDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            npgsqlOptions.UseNetTopologySuite();
            npgsqlOptions.MigrationsAssembly(typeof(TransportDbContext).Assembly.FullName);
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => new
{
    Service = "Transport Service API",
    Status = "Running",
    Timestamp = DateTime.UtcNow
});

app.Run();
