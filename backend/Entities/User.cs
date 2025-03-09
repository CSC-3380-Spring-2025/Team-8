using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace StudyVerseBackend.Entities;

public class User: IdentityUser
{
    public string Name { get; set; } = string.Empty;
    [Required]
    public override string UserName { get; set; } = string.Empty;
    [Required]
    public override string PasswordHash { get; set; } = string.Empty;

    [Required, EmailAddress] public override string Email { get; set; }
    public string Avatar_Url { get; set; } = string.Empty;
    
    public string? CustomizationOptions { get; set; }

    public void SetCustomizationSettings(string settings)
    {
        CustomizationOptions = JsonSerializer.Serialize(settings);
    }

    public string? GetCustomizationOptions<T>()
    {
        return CustomizationOptions != null ? JsonSerializer.Deserialize<string>(CustomizationOptions) : null;
    }
}