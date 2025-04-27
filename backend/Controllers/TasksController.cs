using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using PlannerApi.DTOs;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models;

namespace PlannerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/task/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Tasks>> GetTask(int id)
        {
            /*
             * Retrieves a specific task by its ID.
             * 
             * Inputs:
             * - Route parameter: id (integer) - the ID of the task to retrieve.
             * 
             * Returns:
             * - HTTP 200 OK with the task details if found.
             * - HTTP 404 Not Found if the task does not exist.
             */
            
            var taskItem = await _context.Tasks.FindAsync(id);

            if (taskItem == null)
            {
                return NotFound();
            }

            return taskItem;
        }

        // GET: api/task
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            /*
             * Retrieves all tasks that belong to the currently authenticated user.
             * 
             * Inputs:
             * - JWT token in the request header to identify the user.
             * 
             * Returns:
             * - HTTP 200 OK with a list of the user's tasks.
             * - HTTP 401 Unauthorized if no valid JWT token is provided.
             */
            string? userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized("Missing JWT token in header.");
            }

            var allTask = await _context.Tasks
                .Where(task => task.UserId.Equals(userId))
                .Select(task => new TaskDto
                {
                    Id = task.Id,
                    Description = task.Description,
                    DueDate = task.DueDate.HasValue ? task.DueDate : null,
                    IsCompleted = task.IsCompleted,
                    Title = task.Title,
                    Priority = task.Priority
                })
                .ToListAsync();

            return allTask;
        }

        // POST: api/task
        [HttpPost]
        public async Task<ActionResult<Tasks>> PostTask(TaskDto taskItem)
        {
            /*
             * Creates a new task for the currently authenticated user.
             * 
             * Inputs:
             * - Request body: TaskDto containing title, description, priority, and due date.
             * - JWT token in the request header to identify the user.
             * 
             * Returns:
             * - HTTP 201 Created with the newly created task details.
             * - HTTP 401 Unauthorized if no valid JWT token is provided.
             */
            
            string? userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized("Missing JWT token in header.");
            }

            Tasks task = new Tasks
            {
                UserId = userId,
                Title = taskItem.Title,
                Description = taskItem.Description,
                IsCompleted = false,
                DueDate = taskItem.DueDate.HasValue ? taskItem.DueDate : null,
                Priority = taskItem.Priority,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/task/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, TaskDto taskItem)
        {
            /*
             * Updates an existing task owned by the currently authenticated user.
             * 
             * Inputs:
             * - Route parameter: id (integer) - the ID of the task to update.
             * - Request body: TaskDto containing updated task information.
             * - JWT token in the request header to identify the user.
             * 
             * Returns:
             * - HTTP 204 No Content if the update is successful.
             * - HTTP 400 Bad Request if the ID in the URL and body do not match.
             * - HTTP 401 Unauthorized if no valid JWT token is provided.
             * - HTTP 404 Not Found if the task does not exist or is not owned by the user.
             */
            
            if (id != taskItem.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            string? userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized("Missing JWT token in header.");
            }

            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (existingTask == null)
            {
                return NotFound("Task not found or not authorized.");
            }

            existingTask.Title = taskItem.Title;
            existingTask.Description = taskItem.Description;
            existingTask.Priority = taskItem.Priority;

            if (existingTask.IsCompleted && !taskItem.IsCompleted)
            {
                existingTask.CompletedAt = null;
            }
            else if (!existingTask.IsCompleted && taskItem.IsCompleted)
            {
                existingTask.CompletedAt = DateTime.UtcNow;
            }

            existingTask.IsCompleted = taskItem.IsCompleted;
            existingTask.DueDate = taskItem.DueDate.HasValue ? taskItem.DueDate : null;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskItemExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return CreatedAtAction(nameof(GetTask), new { id = existingTask.Id }, existingTask);
        }

        // DELETE: api/task/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            /*
             * Deletes a specific task by its ID.
             * 
             * Inputs:
             * - Route parameter: id (integer) - the ID of the task to delete.
             * 
             * Returns:
             * - HTTP 204 No Content if the task is successfully deleted.
             * - HTTP 404 Not Found if the task does not exist.
             */
            
            var taskItem = await _context.Tasks.FindAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(taskItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskItemExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }

        private string? GetUserIdFromToken()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
