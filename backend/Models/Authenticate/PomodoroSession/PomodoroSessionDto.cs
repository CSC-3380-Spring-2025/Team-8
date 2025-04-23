namespace StudyVerseBackend.Models.Authenticate.PomodoroSession;

public class PomodoroSessionDto
{
    public int SessionId { get; set; }
    public DateTime FinishingTimeStamp { get; set; }
    public string? Title { get; set; }
    public bool IsPaused { get; set; } = false;
}