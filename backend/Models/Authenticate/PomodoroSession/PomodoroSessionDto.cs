namespace StudyVerseBackend.Models.Authenticate.PomodoroSession;

public class PomodoroSessionDto
{
    public int SessionId { get; set; }
    public DateTime DueTime { get; set; }
    public string? Notes { get; set; }
}