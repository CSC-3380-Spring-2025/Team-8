using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Models.Authenticate.PomodoroSession;
using StudyVerseBackend.Services;


namespace StudyVerseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PomodoroSessionController : ControllerBase
    {
        private readonly PomodoroSessionService _pomodoroSessionService;

        public PomodoroSessionController(PomodoroSessionService pomodoroSessionService)
        {
            _pomodoroSessionService = pomodoroSessionService;
        }

        // GET: api/PomodoroSession
        [HttpGet]
        public async Task<ActionResult<List<PomodoroSessionDto>>> GetAllPomodoroSessions()
        {
            /*
             * Retrieves all Pomodoro sessions belonging to the authenticated user.
             *
             * This endpoint extracts the user ID from the JWT token and returns every
             * Pomodoro session associated with that user, regardless of status.
             *
             * Returns:
             * - HTTP 200 OK with a list of PomodoroSessionDto objects containing:
             *   - SessionId: Unique identifier for the session
             *   - FinishingTimeStamp: When the session is scheduled to end
             *   - Title: Optional descriptive title
             *   - IsPaused: Current pause status
             * - HTTP 401 Unauthorized if the authentication token is invalid
             */
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var sessions = await _pomodoroSessionService.GetAllPomodoroSessions(userId);
            return Ok(sessions);
        }
        
        // GET: api/PomodoroSession/active
        /*
         * Should return a list length of one if there is a active session, else not one.
         */
        [HttpGet("active")]
        public async Task<ActionResult<List<PomodoroSessionDto>>> GetActiveSessions()
        {
            
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var getAllActiveSessions = await _pomodoroSessionService.GetAllPomodoroSessions(userId);

            IEnumerable<PomodoroSessionDto> allActiveSessions = getAllActiveSessions
                .Where(pd => pd.FinishingTimeStamp >= DateTime.Now)
                .Select(ps => new PomodoroSessionDto
                {
                    SessionId = ps.SessionId,
                    FinishingTimeStamp = ps.FinishingTimeStamp,
                    Title = ps.Title ?? "",
                    IsPaused = ps.IsPaused
                });

            return Ok(allActiveSessions);
        }
        
        // PUT: api/PomodoroSession/resume/5
        // PUT: api/PomodoroSession/resume/5
        [HttpPut("resume/{id}")]
        public async Task<ActionResult<PomodoroSessionDto>> ResumePomodoroSession(int id, [FromBody] int secondsLeft)
        {
            /*
             * Resumes a paused Pomodoro session and updates its remaining duration.
             *
             * This endpoint:
             * 1. Verifies the session exists and belongs to the authenticated user
             * 2. Sets IsPaused to false
             * 3. Updates the FinishingTimeStamp based on the provided secondsLeft
             *
             * Parameters:
             * - id: The ID of the session to resume (route parameter)
             * - secondsLeft: The remaining duration in seconds (request body)
             *
             * Returns:
             * - HTTP 200 OK with the updated PomodoroSessionDto if successful
             * - HTTP 401 Unauthorized if the authentication token is invalid
             * - HTTP 404 Not Found if the session doesn't exist or doesn't belong to user
             */
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var session = await _pomodoroSessionService.GetPomodoroSessionById(id);
            if (session == null || session.UserId != userId)
            {
                return NotFound("Session not found or access denied.");
            }

            session.IsPaused = false;
            session.FinishingTimeStamp = DateTime.UtcNow.AddSeconds(secondsLeft);

            var updatedSession = await _pomodoroSessionService.UpdatePomodoroSession(id, session);

            // Convert to DTO
            var updatedDto = new PomodoroSessionDto
            {
                SessionId = updatedSession.SessionId,
                FinishingTimeStamp = updatedSession.FinishingTimeStamp,
                Title = updatedSession.Title,
                IsPaused = updatedSession.IsPaused
            };

            return Ok(updatedDto);
        }
        

        // GET: api/PomodoroSession/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PomodoroSession>> GetPomodoroSession(int id)
        {
            /*
             * Retrieves a specific Pomodoro session by its ID.
             *
             * The endpoint verifies that the session exists and belongs to the
             * authenticated user before returning it.
             *
             * Parameters:
             * - id: The ID of the session to retrieve (route parameter)
             *
             * Returns:
             * - HTTP 200 OK with the complete PomodoroSession entity if found
             * - HTTP 401 Unauthorized if the authentication token is invalid
             * - HTTP 404 Not Found if the session doesn't exist or access is denied
             */
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var session = await _pomodoroSessionService.GetPomodoroSessionById(id);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(session);
        }

        // POST: api/PomodoroSession
        [HttpPost]
        public async Task<ActionResult<PomodoroSession>> CreatePomodoroSession(PomodoroSessionPost sessionDto)
        {
            /*
             * Creates a new Pomodoro session for the authenticated user.
             *
             * The new session is created in a paused state with the specified
             * duration and optional title. The user ID is automatically set from
             * the authentication token.
             *
             * Request Body (PomodoroSessionPost):
             * - DueTime: The planned end time for the session (required)
             * - Title: An optional descriptive title for the session
             *
             * Returns:
             * - HTTP 201 Created with the new PomodoroSession entity
             *   (Includes Location header pointing to the new resource)
             * - HTTP 401 Unauthorized if the authentication token is invalid
             */
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var newSession = new PomodoroSession
            {
                UserId = userId,
                FinishingTimeStamp = sessionDto.DueTime,
                Title = sessionDto.Title,
                IsPaused = true,
            };

            var createdSession = await _pomodoroSessionService.CreatePomodoroSession(newSession);
            return CreatedAtAction(nameof(GetPomodoroSession), new { id = createdSession.SessionId }, createdSession);
        }


        // PUT: api/PomodoroSession/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PomodoroSession>> UpdatePomodoroSession(int id, PomodoroSessionDto sessionDto)
        {
            /*
             * Updates an existing Pomodoro session.
             *
             * Verifies the session exists and belongs to the authenticated user
             * before applying updates. All fields in the DTO are optional except
             * for the session ID.
             *
             * Parameters:
             * - id: The ID of the session to update (route parameter)
             *
             * Request Body (PomodoroSessionDto):
             * - SessionId: Must match the route parameter
             * - FinishingTimeStamp: New end time for the session
             * - Title: New title for the session
             * - IsPaused: New pause status
             *
             * Returns:
             * - HTTP 200 OK with the updated PomodoroSession entity
             * - HTTP 401 Unauthorized if the authentication token is invalid
             * - HTTP 404 Not Found if the session doesn't exist or access is denied
             */
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            // Get the existing session
            var existingSession = await _pomodoroSessionService.GetPomodoroSessionById(id);

            if (existingSession == null || existingSession.UserId != userId)
            {
                return NotFound("Session not found or access denied.");
            }

            // Update fields from DTO
            existingSession.FinishingTimeStamp = sessionDto.FinishingTimeStamp;
            existingSession.Title = sessionDto.Title ?? "";
            existingSession.IsPaused = sessionDto.IsPaused;
            existingSession.UserId = userId;

            var updatedSession = await _pomodoroSessionService.UpdatePomodoroSession(id, existingSession);

            return Ok(updatedSession);
        }

        // DELETE: api/PomodoroSession/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePomodoroSession(int id)

        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var result = await _pomodoroSessionService.DeletePomodoroSession(id);
            if (!result)
            {
                return NotFound();
            }

            return Ok(result);
        }

        private string? GetUserIdFromToken()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        }
    }
