using StudyVerseBackend.Entities;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Infastructure.Contexts;

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

    
    public async Task<List<PomodoroSession>> GetAllPomodoroSessions()
    {
        return await _context.PomodoroSessions.ToListAsync();
    }

    // Get a PomodoroSession by ID
    public async Task<PomodoroSession> GetPomodoroSessionById(int id)
    {
        return await _context.PomodoroSessions.FindAsync(id);
    }

    
    public async Task<PomodoroSession> UpdatePomodoroSession(int id, PomodoroSession updatedSession)
    {
        var session = await _context.PomodoroSessions.FindAsync(id);
        if (session == null)
        {
            return null; 
        }

        session.Title = updatedSession.Title;
        session.FinishingTimeStamp = updatedSession.FinishingTimeStamp;
        session.UserId = updatedSession.UserId;

        await _context.SaveChangesAsync();
        return session;
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
}
