using KrishiEye.Services.Catalog.Domain.Entities;
using KrishiEye.Services.Catalog.Domain.ValueObjects;
using KrishiEye.Services.Catalog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace KrishiEye.Services.Catalog.Infrastructure.Data;

/// <summary>
/// Seeds initial data for the Catalog database.
/// </summary>
public static class CatalogDbInitializer
{
    public static async Task SeedAsync(CatalogDbContext context)
    {
        try
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            if (await context.MeasurementUnits.AnyAsync())
            {
                return; // Data already seeded
            }

            await SeedMeasurementUnitsAsync(context);
            await SeedProductTypesAsync(context);
            await SeedCategoriesAsync(context);
        }
        catch (Exception ex)
        {
            // Log error but don't crash the application  
            Console.WriteLine($"Error seeding database: {ex.Message}");
        }
    }

    private static async Task SeedMeasurementUnitsAsync(CatalogDbContext context)
    {
        var units = new[]
        {
            MeasurementUnit.Kilogram(),
            MeasurementUnit.Gram(),
            MeasurementUnit.Liter(),
            MeasurementUnit.Piece(),
            MeasurementUnit.Dozen(),
            MeasurementUnit.Bag(),
            MeasurementUnit.Create("Ton", "ton", UnitType.Weight),
            MeasurementUnit.Create("Quintal", "qtl", UnitType.Weight),
            MeasurementUnit.Create("Maund", "maund", UnitType.Weight), // Bangladesh unit
            MeasurementUnit.Create("Seer", "seer", UnitType.Weight), // Bangladesh unit
        };

        context.MeasurementUnits.AddRange(units);
        await context.SaveChangesAsync(CancellationToken.None);
    }

    private static async Task SeedProductTypesAsync(CatalogDbContext context)
    {
        var productTypes = new[]
        {
            ProductType.Create(
                "Crop",
                "Agricultural crops and produce",
                SeoMetadata.Create("crop", "Agricultural Crops - Krishi Eye", "Browse fresh agricultural crops directly from farmers")),
            
            ProductType.Create(
                "Farming Tool",
                "Tools and equipment for farming",
                SeoMetadata.Create("farming-tool", "Farming Tools & Equipment", "Quality farming tools and agricultural equipment")),
            
            ProductType.Create(
                "Livestock",
                "Farm animals and poultry",
                SeoMetadata.Create("livestock", "Livestock & Poultry", "Browse healthy livestock and poultry from farms")),
            
            ProductType.Create(
                "Seeds",
                "Seeds for planting",
                SeoMetadata.Create("seeds", "Quality Seeds", "Premium quality seeds for your farm")),
            
            ProductType.Create(
                "Fertilizer",
                "Fertilizers and soil nutrients",
                SeoMetadata.Create("fertilizer", "Fertilizers & Nutrients", "Quality fertilizers for healthy crops")),
        };

        context.ProductTypes.AddRange(productTypes);
        await context.SaveChangesAsync(CancellationToken.None);
    }

    private static async Task SeedCategoriesAsync(CatalogDbContext context)
    {
        var cropTypeId = context.ProductTypes.First(pt => pt.Name == "Crop").Id;

        var categories = new[]
        {
            Category.Create(
                "Vegetables",
                "Fresh vegetables",
                cropTypeId,
                SeoMetadata.Create("vegetables", "Fresh Vegetables", "Farm-fresh vegetables directly from farmers")),
            
            Category.Create(
                "Fruits",
                "Fresh fruits",
                cropTypeId,
                SeoMetadata.Create("fruits", "Fresh Fruits", "Delicious fruits from local farms")),
            
            Category.Create(
                "Grains",
                "Rice, wheat, and other grains",
                cropTypeId,
                SeoMetadata.Create("grains", "Grains & Cereals", "Quality grains from Bangladesh farms")),
        };

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync(CancellationToken.None);

        // Seed SubCategories for Vegetables
        var vegetablesId = context.Categories.First(c => c.Name == "Vegetables").Id;

        var subCategories = new[]
        {
            Category.Create(
                "Leafy Greens",
                "Spinach, lettuce, etc.",
                cropTypeId,
                SeoMetadata.Create("leafy-greens", "Leafy Green Vegetables", "Fresh leafy greens"),
                vegetablesId),
            
            Category.Create(
                "Root Vegetables",
                "Potatoes, carrots, radish",
                cropTypeId,
                SeoMetadata.Create("root-vegetables", "Root Vegetables", "Fresh root vegetables"),
                vegetablesId),
        };

        context.Categories.AddRange(subCategories);
        await context.SaveChangesAsync(CancellationToken.None);
    }
}
