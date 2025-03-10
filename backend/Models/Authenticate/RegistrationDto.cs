using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Models.Authenticate;

public class RegistrationDto
{
    [Required(ErrorMessage = "A account name is required")]
    public string Name { get; set; }
    
    [Required(ErrorMessage = "A username is required.")]
    public string UserName { get; set; }
    
    [EmailAddress]
    [Required(ErrorMessage = "A email is required.")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "A password is required.")]
    public string Password { get; set; }
    public string? Avatar_Url { get; set; } = String.Empty;
    public string? CustomizationOptions { get; set; }
}