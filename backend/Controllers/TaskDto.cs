namespace PlannerApi.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
    
     public TaskDto()
    {
        Title = string.Empty;
        Description = string.Empty;
    }
}
}


