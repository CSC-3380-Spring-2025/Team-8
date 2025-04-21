using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models.GalaxyBoost;

namespace StudyVerseBackend.Services
{
    public class GravityBoostService
    {
        private readonly ApplicationDbContext _context;

        public GravityBoostService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GalaxyBoostRes>> GetAllBoosts(string userId)
        {
            return await _context.GravityBoosts.Where(gb => gb.Receiver_Id == userId)
                .Select(boost => new GalaxyBoostRes
                {
                    Boost_Id = boost.Boost_Id,
                    message = boost.Message,
                    sender_id = boost.Sender_Id,
                    sender_name = boost.Sender.Name,
                    receiver_id = boost.Receiver_Id
                })
                .ToListAsync();
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

        public async Task<GravityBoosts> SendBoost(string userId, GalaxyBoostPostDto galaxyBoostPost)
        {
            // Make a gravity boost object

            GravityBoosts gb = new GravityBoosts
            {
                Sender_Id = userId,
                Receiver_Id = galaxyBoostPost.receiver_id,
                Message = galaxyBoostPost.message,
            };

            _context.GravityBoosts.Add(gb);

            await _context.SaveChangesAsync();

            return gb;
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

