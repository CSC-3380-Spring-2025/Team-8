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

using StudyVerseBackend.Models.CalendarEvents;



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
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetUserEvents()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .Select(e => new CalendarEventDto
                {
                    Id = e.EventId,
                    EventDate = e.EventDate,
                    Description = e.Description,
                    Title = e.Title,
                    EventType = e.EventType
                })
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

        [HttpPost]
public async Task<ActionResult<CalendarEvent>> CreateEvent(CalendarEventDto calendarEventDto)
{
    var userId = GetUserIdFromToken();
    if (userId == null) return Unauthorized("Invalid User Token");

    var calendarEvent = new CalendarEvent
    {
        UserId = userId,
        Title = calendarEventDto.Title,
        Description = calendarEventDto.Description,
        EventDate = calendarEventDto.EventDate,
        EventType = calendarEventDto.EventType
    };

    _context.CalendarEvents.Add(calendarEvent);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetEventById), new { id = calendarEvent.EventId }, calendarEvent);
}

        [HttpPut("{id}")]
public async Task<IActionResult> UpdateEvent(int id, CalendarEventDto calendarEventDto)
{
    var userId = GetUserIdFromToken();
    if (userId == null) return Unauthorized("Invalid User Token");

    var existingEvent = await _context.CalendarEvents.FindAsync(id);
    if (existingEvent == null || existingEvent.UserId != userId)
    {
        return NotFound("Event not found or unauthorized access.");
    }

    existingEvent.Title = calendarEventDto.Title;
    existingEvent.Description = calendarEventDto.Description;
    existingEvent.EventDate = calendarEventDto.EventDate;
    existingEvent.EventType = calendarEventDto.EventType;

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
