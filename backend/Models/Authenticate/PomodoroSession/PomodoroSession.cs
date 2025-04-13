namespace StudyVerseBackend.Models.Authenticate.PomodoroSession;

public class PomodoroSession
{
    public int SessionId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Notes { get; set; }
    public string Id { get; set; } // Added from the JWT token
}