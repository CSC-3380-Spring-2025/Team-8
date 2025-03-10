using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Models.Authenticate;

public class LoginDto
{
    public string? UserName { get; set; }
    
    [EmailAddress]
    public string? Email { get; set; }
    
    [Required(ErrorMessage = "Missing the password. Please provide a password.")]
    public string Password { get; set; }
}