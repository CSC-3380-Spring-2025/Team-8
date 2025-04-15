namespace StudyVerseBackend.Models.CalendarEvents
{
    public class CalendarEventDto
    {
        public int Id { get; set; } // Event ID
        public DateTime EventDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string EventType { get; set; }
    }
}
