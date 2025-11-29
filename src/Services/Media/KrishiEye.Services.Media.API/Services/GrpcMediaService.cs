using Grpc.Core;
using MediatR;
using KrishiEye.Services.Media.API.Protos;
using KrishiEye.Services.Media.API.Features.Files.DeleteFile;
using KrishiEye.Services.Media.API.Services;

namespace KrishiEye.Services.Media.API.Services;

public class GrpcMediaService : MediaGrpc.MediaGrpcBase
{
    private readonly IMediator _mediator;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<GrpcMediaService> _logger;

    public GrpcMediaService(IMediator mediator, IFileStorageService fileStorageService, ILogger<GrpcMediaService> logger)
    {
        _mediator = mediator;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public override async Task<UploadFileResponse> UploadFile(IAsyncStreamReader<UploadFileRequest> requestStream, ServerCallContext context)
    {
        try
        {
            if (!await requestStream.MoveNext())
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "No data received"));
            }

            var metadata = requestStream.Current.Metadata;
            if (metadata == null)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "First message must be metadata"));
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(metadata.FileName)}";
            var (uploadStream, fileUrl) = await _fileStorageService.OpenWriteAsync(fileName, metadata.ContentType);

            await using (uploadStream)
            {
                while (await requestStream.MoveNext())
                {
                    var chunk = requestStream.Current.Chunk;
                    if (chunk != null)
                    {
                        await uploadStream.WriteAsync(chunk.Memory);
                    }
                }
            }

            return new UploadFileResponse { FileUrl = fileUrl };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file via gRPC");
            throw new RpcException(new Status(StatusCode.Internal, ex.Message));
        }
    }

    public override async Task<DeleteFileResponse> DeleteFile(DeleteFileRequest request, ServerCallContext context)
    {
        try
        {
            await _mediator.Send(new DeleteFileCommand(request.FileUrl));
            return new DeleteFileResponse { Success = true, Message = "File deleted successfully" };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file via gRPC");
            return new DeleteFileResponse { Success = false, Message = ex.Message };
        }
    }
}
