using StudyVerseBackend.Entities;
namespace StudyVerseBackend.Models

{
    public class TaskItem
    {
        public int Id { get; set; }  
        
        public string Title { get; set; } = string.Empty;  // Default value (empty string)
        
        public string Description { get; set; } = string.Empty;  // Default value (empty string)
        
        public bool IsCompleted { get; set; } = false;  // Default value (false)
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // Default value (current time)
        
        public DateTime? CompletedAt { get; set; }  // Nullable, will be null until completed
         // Foreign key
        public int UserId { get; set; }
        public User User { get; set; } // Navigation property
    }
}
