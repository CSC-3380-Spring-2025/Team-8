
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace StudyVerseBackend.Entities;



public class PomodoroSession

{
    [Required]
    public int SessionId { get;set; }
    
   [Required] 
   [Column("user_id")]
   public int UserId { get; set; }
   
   
   
   [Required]
   [Column("finishing_timestamp")]
   public DateTime FinishingTimeStamp { get; set; }

 
   [Required]
   [MaxLength(255)]
   [Column("title")]
   public string Title { get; set; } = string.Empty;
}

   