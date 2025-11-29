using KrishiEye.Services.Transport.Application.Common.Interfaces;
using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace KrishiEye.Services.Transport.Application.Features.Files.Commands.UploadFile
{
    public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, string>
    {
        private readonly IFileStorageService _fileStorageService;

        public UploadFileCommandHandler(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<string> Handle(UploadFileCommand request, CancellationToken cancellationToken)
        {
            if (request.File == null || request.File.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.File.FileName)}";
            using var stream = request.File.OpenReadStream();
            
            return await _fileStorageService.UploadFileAsync(stream, fileName, request.File.ContentType);
        }
    }
}
