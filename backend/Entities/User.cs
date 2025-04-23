using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Enumerations;

namespace StudyVerseBackend.Entities;

public class User : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    [Required]
    public override string UserName { get; set; } = string.Empty;
    [Required]
    public override string PasswordHash { get; set; } = string.Empty;

    [Required, EmailAddress] public override string Email { get; set; }
    public string Avatar_Url { get; set; } = string.Empty;

    public string? CustomizationOptions { get; set; }

    public ICollection<Tasks> Tasks { get; } = new List<Tasks>();
    public ICollection<CalendarEvent> CalendarEvents { get; } = new List<CalendarEvent>();
    public ICollection<PomodoroSession> PomodoroSessions { get; } = new List<PomodoroSession>();

    public PlanetStatus PlanetStatus = PlanetStatus.Mercury;
    public int Stars = 0;

    public ICollection<ConstellationStatus> ConstellationStatuses = new List<ConstellationStatus>();

    public ICollection<Friends> FriendRequestsSent { get; set; } = new List<Friends>();
    public ICollection<Friends> FriendRequestsReceived { get; set; } = new List<Friends>();

    public IEnumerable<User> AllFriends =>
        FriendRequestsSent
            .Where(f => f.Status == FriendshipStatus.Accepted)
            .Select(f => f.Recipient)
        .Concat(
            FriendRequestsReceived
            .Where(f => f.Status == FriendshipStatus.Accepted)
            .Select(f => f.Requestor)
        );


    public void SetCustomizationSettings(string settings)
    {
        CustomizationOptions = JsonSerializer.Serialize(settings);
    }

    public string? GetCustomizationOptions<T>()
    {
        return CustomizationOptions != null ? JsonSerializer.Deserialize<string>(CustomizationOptions) : null;
    }
}