using System.Reflection;
using FluentValidation;
using KrishiEye.Services.Catalog.Application.Common.Behaviors;
using Microsoft.Extensions.DependencyInjection;

namespace KrishiEye.Services.Catalog.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // Register all validators
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        return services;
    }
}
