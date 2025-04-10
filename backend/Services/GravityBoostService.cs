using StudyVerseBackend.Entities;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Infastructure.Contexts;

namespace StudyVerseBackend.Services
{
    public class GravityBoostService
    {
        private readonly ApplicationDbContext _context;

        public GravityBoostService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GravityBoosts> CreateBoost(GravityBoosts boost)
        {
            _context.GravityBoosts.Add(boost);
            await _context.SaveChangesAsync();
            return boost;
        }

        public async Task<List<GravityBoosts>> GetAllBoosts()
        {
            return await _context.GravityBoosts.ToListAsync();
        }

        public async Task<GravityBoosts> GetBoostById(int id)
        {
            return await _context.GravityBoosts.FindAsync(id);
        }

        public async Task<GravityBoosts> UpdateBoost(int id, GravityBoosts updatedBoost)
        {
            var existing = await _context.GravityBoosts.FindAsync(id);
            if (existing == null) return null;

            existing.Sender_Id = updatedBoost.Sender_Id;
            existing.Receiver_Id = updatedBoost.Receiver_Id;
            existing.Message = updatedBoost.Message;
            existing.Sent_At = updatedBoost.Sent_At;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteBoost(int id)
        {
            var boost = await _context.GravityBoosts.FindAsync(id);
            if (boost == null) return false;

            _context.GravityBoosts.Remove(boost);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
