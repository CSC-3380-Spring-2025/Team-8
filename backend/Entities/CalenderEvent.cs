namespace StudyVerseBackend.Entities
{
    public class CalendarEvent
    {
        public int EventId { get; set; }  
        public int UserId { get; set; }    
        public string Title { get; set; }   
        public string Description { get; set; } 
        public DateTime EventDate { get; set; }
        public string EventType { get; set; }         
        
        public User User { get; set; }
    }
}
