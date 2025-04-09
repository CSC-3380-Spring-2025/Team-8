using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
public class Task
{
    public int Id { get; set; }  // Primary key for Task

    public string Title { get; set; }  // Title of the task

    public string Description { get; set; }  // Detailed description of the task

    public bool IsCompleted { get; set; }  // Status of whether the task is completed

    public DateTime DueDate { get; set; }  // The date and time by which the task should be completed

    public int Priority { get; set; }  // Priority of the task (1 = Low, 2 = Medium, 3 = High)

    public DateTime CreatedAt { get; set; } = DateTime.Now; // The date when the task was created

    public DateTime? CompletedAt { get; set; }  // The date when the task was completed (nullable if not completed yet)

    public string UserId { get; set; }  // Link this task to a specific user (optional, if using user authentication)
    public User CurrentUser { get; set; }

}
 
