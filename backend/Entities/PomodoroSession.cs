using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyVerseBackend.Entities;

public class PomodoroSession

{
    [Required] 
    [Key]
    public int SessionId { get; set; }
    [Required] 
    public string UserId { get; set; }
    public User CurrentUser { get; set; }
    [Required] 
    public DateTime FinishingTimeStamp { get; set; }
    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    public bool IsPaused { get; set; } = false;
}