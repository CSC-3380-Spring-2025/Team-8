
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace StudyVerseBackend.Entities;



public class PomodoroSession

{
    public PomodoroSession(string userId)
    {
        UserId = userId;
    } 
    [Required]
     public int SessionId { get;set; }
     [Required] 
       public String UserId { get; set; }
   [Required]
   public DateTime FinishingTimeStamp { get; set; }

 
   [Required]
   [MaxLength(255)]
   [Column("title")]
   public string Title { get; set; } = string.Empty;
}

   