using System.Text.Json;
using KrishiEye.Services.Catalog.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace KrishiEye.Services.Catalog.Infrastructure.Caching;

/// <summary>
/// Redis-based distributed cache service implementation.
/// </summary>
public class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;
    private readonly CacheSettings _settings;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisCacheService(
        IConnectionMultiplexer redis,
        IOptions<CacheSettings> settings,
        ILogger<RedisCacheService> logger)
    {
        _redis = redis;
        _database = redis.GetDatabase();
        _settings = settings.Value;
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = false
        };
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
    {
        if (!_settings.EnableCaching)
            return null;

        try
        {
            var value = await _database.StringGetAsync(key);
            
            if (!value.HasValue)
            {
                _logger.LogDebug("Cache miss for key: {CacheKey}", key);
                return null;
            }

            _logger.LogDebug("Cache hit for key: {CacheKey}", key);
            return JsonSerializer.Deserialize<T>(value!, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting value from cache for key: {CacheKey}", key);
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class
    {
        if (!_settings.EnableCaching)
            return;

        try
        {
            var serialized = JsonSerializer.Serialize(value, _jsonOptions);
            var ttl = expiration ?? _settings.DefaultCacheDuration;
            
            await _database.StringSetAsync(key, serialized, ttl);
            
            _logger.LogDebug("Cached value for key: {CacheKey} with TTL: {TTL}", key, ttl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting value in cache for key: {CacheKey}", key);
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        if (!_settings.EnableCaching)
            return;

        try
        {
            await _database.KeyDeleteAsync(key);
            _logger.LogDebug("Removed cache key: {CacheKey}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache key: {CacheKey}", key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
    {
        if (!_settings.EnableCaching)
            return;

        try
        {
            var endpoints = _redis.GetEndPoints();
            var server = _redis.GetServer(endpoints.First());
            
            var keys = server.Keys(pattern: $"{prefix}*").ToArray();
            
            if (keys.Length > 0)
            {
                await _database.KeyDeleteAsync(keys);
                _logger.LogInformation("Removed {Count} cache keys with prefix: {Prefix}", keys.Length, prefix);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache keys with prefix: {Prefix}", prefix);
        }
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        if (!_settings.EnableCaching)
            return false;

        try
        {
            return await _database.KeyExistsAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if cache key exists: {CacheKey}", key);
            return false;
        }
    }

    public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T?>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class
    {
        // Try to get from cache first
        var cachedValue = await GetAsync<T>(key, cancellationToken);
        if (cachedValue != null)
            return cachedValue;

        // Cache miss - execute factory with distributed lock to prevent cache stampede
        var lockKey = $"lock:{key}";
        var lockValue = Guid.NewGuid().ToString();
        var lockExpiry = TimeSpan.FromSeconds(10);

        // Try to acquire lock
        var lockAcquired = await _database.StringSetAsync(lockKey, lockValue, lockExpiry, When.NotExists);

        if (lockAcquired)
        {
            try
            {
                var value = await factory();
                
                if (value != null)
                {
                    await SetAsync(key, value, expiration, cancellationToken);
                }
                
                return value;
            }
            finally
            {
                await _database.KeyDeleteAsync(lockKey);
            }
        }
        else
        {
            // Another process is loading - wait a bit and try cache again
            await Task.Delay(100, cancellationToken);
            var retryValue = await GetAsync<T>(key, cancellationToken);
            
            if (retryValue != null)
                return retryValue;

            // Still not in cache - just execute factory without lock
            return await factory();
        }
    }
}
