namespace StudyVerseBackend.Models.Authenticate;

public class ProfileResDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string? AvatarUrl { get; set; }
    public string Planet { get; set; }
}