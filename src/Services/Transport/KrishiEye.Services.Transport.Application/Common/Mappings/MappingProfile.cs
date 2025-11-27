using System.Reflection;
using Mapster;

namespace KrishiEye.Services.Transport.Application.Common.Mappings;

public class MappingProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.Scan(Assembly.GetExecutingAssembly());
    }
}
