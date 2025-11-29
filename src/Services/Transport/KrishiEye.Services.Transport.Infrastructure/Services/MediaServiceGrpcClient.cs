using Grpc.Net.Client;
using KrishiEye.Services.Transport.Application.Common.Interfaces;
using KrishiEye.Services.Media.API.Protos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace KrishiEye.Services.Transport.Infrastructure.Services;

public class MediaServiceGrpcClient : IFileStorageService
{
    private readonly MediaGrpc.MediaGrpcClient _client;
    private readonly ILogger<MediaServiceGrpcClient> _logger;

    public MediaServiceGrpcClient(IConfiguration configuration, ILogger<MediaServiceGrpcClient> logger)
    {
        _logger = logger;
        var mediaServiceUrl = configuration["MediaService:Url"] ?? "https://localhost:5005";
        var channel = GrpcChannel.ForAddress(mediaServiceUrl);
        _client = new MediaGrpc.MediaGrpcClient(channel);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        try
        {
            var call = _client.UploadFile();

            // Send Metadata
            await call.RequestStream.WriteAsync(new UploadFileRequest
            {
                Metadata = new FileMetadata { FileName = fileName, ContentType = contentType }
            });

            // Send Chunks
            var buffer = new byte[32 * 1024]; // 32KB chunks
            int bytesRead;
            while ((bytesRead = await fileStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
            {
                await call.RequestStream.WriteAsync(new UploadFileRequest
                {
                    Chunk = Google.Protobuf.ByteString.CopyFrom(buffer, 0, bytesRead)
                });
            }

            await call.RequestStream.CompleteAsync();
            var response = await call.ResponseAsync;
            
            return response.FileUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file via gRPC");
            throw;
        }
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        try
        {
            var request = new DeleteFileRequest { FileUrl = fileUrl };
            var response = await _client.DeleteFileAsync(request);

            if (!response.Success)
            {
                _logger.LogWarning("Failed to delete file via gRPC: {Message}", response.Message);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Media Service gRPC");
            throw;
        }
    }
}
