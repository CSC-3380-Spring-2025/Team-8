using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Entities
{
    public class CalendarEvent
    {
        [Required]
        [Key]
        public int EventId { get; set; }
        public string UserId { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTime EventDate { get; set; }
        public string EventType { get; set; } = string.Empty;

        [Required]
        public User User { get; set; }
    }
}
