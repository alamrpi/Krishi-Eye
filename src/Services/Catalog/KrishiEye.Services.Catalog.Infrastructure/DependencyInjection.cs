using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using KrishiEye.Services.Catalog.Domain.Repositories;
using KrishiEye.Services.Catalog.Infrastructure.Caching;
using KrishiEye.Services.Catalog.Infrastructure.Caching.Decorators;
using KrishiEye.Services.Catalog.Infrastructure.Persistence;
using KrishiEye.Services.Catalog.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace KrishiEye.Services.Catalog.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<CatalogDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICatalogDbContext>(provider => provider.GetRequiredService<CatalogDbContext>());

        // Redis Connection
        var redisConnection = configuration["Redis:ConnectionString"] ?? "localhost:6379";
        services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnection));

        // Cache Settings
        services.Configure<CacheSettings>(options => 
            configuration.GetSection(CacheSettings.SectionName).Bind(options));

        // Cache Service
        services.AddSingleton<ICacheService, RedisCacheService>();

        // Register repositories (uncached)
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<ProductRepository>(); // Concrete implementation first

        // Register cached decorator
        services.AddScoped<IProductRepository>(provider =>
        {
            var inner = provider.GetRequiredService<ProductRepository>();
            var cache = provider.GetRequiredService<ICacheService>();
            var settings = provider.GetRequiredService<Microsoft.Extensions.Options.IOptions<CacheSettings>>();
            var logger = provider.GetRequiredService<Microsoft.Extensions.Logging.ILogger<CachedProductRepository>>();
            
            return new CachedProductRepository(inner, cache, settings, logger);
        });

        return services;
    }
}
