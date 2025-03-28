using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StudyVerseBackend.Controllers
{
    [Route("api/calendar")]
    [ApiController]
    [Authorize] // Ensures all endpoints require authentication
    public class CalendarEventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public CalendarEventController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/calendar (Get all events for logged-in user)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEvent>>> GetUserEvents()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/calendar/{id} (Get specific event by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<CalendarEvent>> GetEventById(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var calendarEvent = await _context.CalendarEvents.FindAsync(id);
            if (calendarEvent == null || calendarEvent.UserId != userId)
            {
                return NotFound("Event not found or unauthorized access.");
            }

            return Ok(calendarEvent);
        }

        //POST: api/calendar (Create a new event)
        [HttpPost]
        public async Task<ActionResult<CalendarEvent>> CreateEvent(CalendarEvent calendarEvent)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            calendarEvent.UserId = userId; // Assign event to logged-in user
            _context.CalendarEvents.Add(calendarEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEventById), new { id = calendarEvent.EventId }, calendarEvent);
        }

        // PUT: api/calendar/{id} (Update an event)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, CalendarEvent calendarEvent)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            if (id != calendarEvent.EventId) return BadRequest("Event ID mismatch");

            var existingEvent = await _context.CalendarEvents.FindAsync(id);
            if (existingEvent == null || existingEvent.UserId != userId)
            {
                return NotFound("Event not found or unauthorized access.");
            }

            existingEvent.Title = calendarEvent.Title;
            existingEvent.Description = calendarEvent.Description;
            existingEvent.EventDate = calendarEvent.EventDate;
            existingEvent.EventType = calendarEvent.EventType;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/calendar/{id} (Delete an event)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var calendarEvent = await _context.CalendarEvents.FindAsync(id);
            if (calendarEvent == null || calendarEvent.UserId != userId)
            {
                return NotFound("Event not found or unauthorized access.");
            }

            _context.CalendarEvents.Remove(calendarEvent);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Extract User ID from JWT Token
        private string? GetUserIdFromToken()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
