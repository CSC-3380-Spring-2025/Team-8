using StudyVerseBackend.Entities;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models.Authenticate.PomodoroSession;

namespace StudyVerseBackend.Services;

public class PomodoroSessionService
{
    private readonly ApplicationDbContext _context;

    public PomodoroSessionService(ApplicationDbContext context)
    {
        _context = context;
    }

   
    public async Task<PomodoroSession> CreatePomodoroSession(PomodoroSession session)
    {
        _context.PomodoroSessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    
    public async Task<List<PomodoroSessionDto>> GetAllPomodoroSessions()
    {
        return await _context.PomodoroSessions
            .Select(ps => new PomodoroSessionDto
            {
                SessionId = ps.SessionId,
                FinishingTimeStamp = ps.FinishingTimeStamp,
                Title = ps.Title ?? "",
                IsPaused = ps.IsPaused
            })
            .ToListAsync();
    }

    // Get a PomodoroSession by ID
    public async Task<PomodoroSession> GetPomodoroSessionById(int id)
    {
        return await _context.PomodoroSessions.FindAsync(id);
    }

    
    public async Task<PomodoroSessionDto> UpdatePomodoroSession(int id, PomodoroSession updatedSession)
    {
        var session = await _context.PomodoroSessions.FindAsync(id);
        if (session == null) return null;

        session.Title = updatedSession.Title;
        session.FinishingTimeStamp = updatedSession.FinishingTimeStamp;
        session.UserId = updatedSession.UserId;
        session.IsPaused = updatedSession.IsPaused;

        await _context.SaveChangesAsync();

        return new PomodoroSessionDto
        {
            SessionId = session.SessionId,
            FinishingTimeStamp = session.FinishingTimeStamp,
            Title = session.Title,
            IsPaused = session.IsPaused
        };
    }

    
    public async Task<bool> DeletePomodoroSession(int id)
    {
        var session = await _context.PomodoroSessions.FindAsync(id);
        if (session == null)
        {
            return false; 
        }

        _context.PomodoroSessions.Remove(session);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<List<PomodoroSession>> GetAllPomodoroSessions(string userId)
    {
        return await _context.PomodoroSessions
            .Where(session => session.UserId == userId) // Ensure users only see their sessions
            .ToListAsync();
    }
}
