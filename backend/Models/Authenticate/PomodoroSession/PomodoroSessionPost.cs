namespace StudyVerseBackend.Models.Authenticate.PomodoroSession;

public class PomodoroSessionPost
{
    public string Title { get; set; }
    public DateTime DueTime { get; set; } = DateTime.Now.Add(TimeSpan.FromMinutes(25));
}