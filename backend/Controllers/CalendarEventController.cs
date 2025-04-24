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

        // GET: api/calendar
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetUserEvents()
        {
            /*
             * Retrieves all calendar events associated with the currently authenticated user.
             *
             * This endpoint identifies the user via their JWT token, queries the database for all events
             * that match their user ID, and returns a list of simplified CalendarEventDto objects.
             *
             * Returns:
             * - HTTP 200 OK with a list of the user's events if successful.
             * - HTTP 401 Unauthorized if no valid token is provided.
             */

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

        // GET: api/calendar/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CalendarEvent>> GetEventById(int id)
        {
            /*
             * Retrieves a specific calendar event by its ID for the authenticated user.
             *
             * Inputs:
             * - id (int): The ID of the calendar event to retrieve.
             *
             * Returns:
             * - HTTP 200 OK with the full CalendarEvent object if found and owned by the user.
             * - HTTP 401 Unauthorized if no valid token is provided.
             * - HTTP 404 Not Found if the event doesn't exist or doesn't belong to the user.
             */

            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var calendarEvent = await _context.CalendarEvents.FindAsync(id);
            if (calendarEvent == null || calendarEvent.UserId != userId)
            {
                return NotFound("Event not found or unauthorized access.");
            }

            return Ok(calendarEvent);
        }

        // POST: api/calendar
        [HttpPost]
        public async Task<ActionResult<CalendarEvent>> CreateEvent(CalendarEventDto calendarEventDto)
        {
            /*
             * Creates a new calendar event for the authenticated user.
             *
             * Inputs:
             * - calendarEventDto (CalendarEventDto): Contains the title, description, event date, and event type.
             *
             * Returns:
             * - HTTP 201 Created with the created CalendarEvent object.
             * - HTTP 401 Unauthorized if no valid token is provided.
             */

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

        // PUT: api/calendar/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, CalendarEventDto calendarEventDto)
        {
            /*
             * Updates an existing calendar event by its ID for the authenticated user.
             *
             * Inputs:
             * - id (int): The ID of the calendar event to update.
             * - calendarEventDto (CalendarEventDto): The updated event details (title, description, date, type).
             *
             * Returns:
             * - HTTP 204 No Content if the update is successful.
             * - HTTP 401 Unauthorized if no valid token is provided.
             * - HTTP 404 Not Found if the event doesn't exist or doesn't belong to the user.
             */

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

        // DELETE: api/calendar/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            /*
             * Deletes a calendar event by its ID for the authenticated user.
             *
             * Inputs:
             * - id (int): The ID of the calendar event to delete.
             *
             * Returns:
             * - HTTP 204 No Content if deletion is successful.
             * - HTTP 401 Unauthorized if no valid token is provided.
             * - HTTP 404 Not Found if the event doesn't exist or doesn't belong to the user.
             */

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

        // Helper method to extract the user ID from the JWT token
        private string? GetUserIdFromToken()
        {
            /*
             * Extracts the user's ID from the JWT token in the request header.
             *
             * Returns:
             * - The user ID string if found in the token.
             * - null if the token is missing or does not contain a user ID claim.
             */
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
