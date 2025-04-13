using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyVerseBackend.Entities;
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
            var sessions = await _pomodoroSessionService.GetAllPomodoroSessions();
            return Ok(sessions);
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
        public async Task<ActionResult<PomodoroSession>> CreatePomodoroSession(PomodoroSession session)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var createdSession = await _pomodoroSessionService.CreatePomodoroSession(session);
            return CreatedAtAction(nameof(GetPomodoroSession), new { id = createdSession.SessionId }, createdSession);
        }

        // PUT: api/PomodoroSession/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PomodoroSession>> UpdatePomodoroSession(int id, PomodoroSession updatedSession)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized("Invalid User Token");
            var session = await _pomodoroSessionService.UpdatePomodoroSession(id, updatedSession);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(session);
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
