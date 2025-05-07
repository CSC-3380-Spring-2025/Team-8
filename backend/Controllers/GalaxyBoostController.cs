using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Infastructure.Enumerations;
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
            
            // Update the person who recieves this message stars!!
            await UpdatePlanetStatusFromBoost(galaxyBoostPost.receiver_id);

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
        
        /**
         * This method updates the planet status of a user based on the number of gravity boosts they have received in the last 7 days.
         */
        public async Task<bool> UpdatePlanetStatusFromBoost(string receiverId)
        {
            // Find the user
            var user = await _context.Users.FindAsync(receiverId);
            if (user == null)
                return false;
            
            var recentBoostCount = await _context.GravityBoosts
                .Where(gb => gb.Receiver_Id == receiverId && gb.Sent_At >= DateTime.UtcNow.AddDays(-7))
                .CountAsync();

            var currentPlanet = user.PlanetStatus;
            
            // Update planet based on boost count
            /**
             * If a user has recieved 5 or more boosts in the last 7 days, they will advance 2 planets.
             * Else: If they have received 2 or more boosts, they will advance 1 planet.
             
             */

            if (recentBoostCount >= 5) 
            {
                if ((int)currentPlanet + 2 <= (int)PlanetStatus.Pluto)
                    user.PlanetStatus = (PlanetStatus)((int)currentPlanet + 2);
                else
                    user.PlanetStatus = PlanetStatus.Pluto;
                
                user.Stars += 15;
            }
            else if (recentBoostCount >= 2) 
            {
                // Advance 1 planet
                if ((int)currentPlanet + 1 <= (int)PlanetStatus.Pluto)
                    user.PlanetStatus = (PlanetStatus)((int)currentPlanet + 1);
                
                user.Stars += 8;
            }
            
            // Save changes if planet status changed
            if (user.PlanetStatus != currentPlanet)
            {
                await _context.SaveChangesAsync();
                return true;
            }
            
            return false;
        }
    }
}

