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

        // GET: api/task/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tasks>> GetTask(int id)
        {
            var taskItem = await _context.Tasks.FindAsync(id);

            if (taskItem == null)
            {
                return NotFound();
            }

            return taskItem;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
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
            string? userId = GetUserIdFromToken();

            if (userId == null)
            {
                return Unauthorized("Missing JWT token in header.");
            }

            // Map the Task DTO to a task object so the database recognizes it
            Tasks task = new Tasks
            {
                UserId = userId,
                Title = taskItem.Title,
                Description = taskItem.Description,
                IsCompleted = false,
                DueDate = taskItem.DueDate.HasValue ? taskItem.DueDate : null,
                Priority = taskItem.Priority,
                CreatedAt = DateTime.Now
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/task/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, TaskDto taskItem)
        {
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

            // Map updated values from DTO to entity
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

            return NoContent();
        }


        // DELETE: api/task/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
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

        // Extract User ID from JWT Token
        private string? GetUserIdFromToken()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
