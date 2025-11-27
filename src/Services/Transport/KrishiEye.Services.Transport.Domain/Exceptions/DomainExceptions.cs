namespace KrishiEye.Services.Transport.Domain.Exceptions;

/// <summary>
/// Base exception for all domain-related exceptions
/// </summary>
public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message)
    {
    }

    protected DomainException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}

/// <summary>
/// Thrown when a business rule is violated
/// </summary>
public class BusinessRuleValidationException : DomainException
{
    public BusinessRuleValidationException(string message) : base(message)
    {
    }
}

/// <summary>
/// Thrown when an entity is not found
/// </summary>
public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, Guid id)
        : base($"{entityName} with ID '{id}' was not found")
    {
    }

    public EntityNotFoundException(string message) : base(message)
    {
    }
}

/// <summary>
/// Thrown when invalid state transition is attempted
/// </summary>
public class InvalidStateTransitionException : DomainException
{
    public InvalidStateTransitionException(string currentState, string targetState)
        : base($"Cannot transition from '{currentState}' to '{targetState}'")
    {
    }
}
