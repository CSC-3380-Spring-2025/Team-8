using StudyVerseBackend.Entities;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Infastructure.Contexts;

namespace StudyVerseBackend.Services;
{
    public class GravityBoostService
    {
        private readonly ApplicationDbContext _context;

        public GravityBoostService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GravityBoost> CreateBoost(GravityBoost boost)
        {
            _context.GravityBoosts.Add(boost);
            await _context.SaveChangesAsync();
            return boost;
        }

        public async Task<List<GravityBoost>> GetAllBoosts()
        {
            return await _context.GravityBoosts.ToListAsync();
        }

        public async Task<GravityBoost> GetBoostById(int id)
        {
            return await _context.GravityBoosts.FindAsync(id);
        }

        public async Task<GravityBoost> UpdateBoost(int id, GravityBoost updatedBoost)
        {
            var existing = await _context.GravityBoosts.FindAsync(id);
            if (existing == null) return null;

            existing.Sender_Id = updatedBoost.SenderId;
            existing.Receiver_Id = updatedBoost.ReceiverId;
            existing.Message = updatedBoost.Message;
            existing.Sent_At = updatedBoost.SentAt;

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
