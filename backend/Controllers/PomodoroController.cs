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
        public async Task<ActionResult<List<PomodoroSession>>> GetAllPomodoroSessions()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var sessions = await _pomodoroSessionService.GetAllPomodoroSessions(userId);
            return Ok(sessions);
        }
        
        // GET: api/PomodoroSession/active
        /*
         * Should return a list length of one if there is a active session, else not one.
         */
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
                    DueTime = ps.FinishingTimeStamp,
                    Title = ps.Title ?? ""
                });

            return Ok(allActiveSessions);
        }

        // GET: api/PomodoroSession/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PomodoroSession>> GetPomodoroSession(int id)
        {
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
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            var newSession = new PomodoroSession
            {
                UserId = userId,
                FinishingTimeStamp = sessionDto.DueTime,
                Title = sessionDto.Title,
            };

            var createdSession = await _pomodoroSessionService.CreatePomodoroSession(newSession);
            return CreatedAtAction(nameof(GetPomodoroSession), new { id = createdSession.SessionId }, createdSession);
        }


        // PUT: api/PomodoroSession/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PomodoroSession>> UpdatePomodoroSession(int id, PomodoroSessionDto sessionDto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");

            // Get the existing session
            var existingSession = await _pomodoroSessionService.GetPomodoroSessionById(id);

            if (existingSession == null || existingSession.UserId != userId)
            {
                return NotFound("Session not found or access denied.");
            }

            // Update fields from DTO
            existingSession.FinishingTimeStamp = sessionDto.DueTime;
            existingSession.Title = sessionDto.Title;

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
