using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Enumerations;
using System.Security.Claims;
using StudyVerseBackend.Infastructure.Contexts;

namespace StudyVerseBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FriendsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Friends/request
        /* Uses the JWT token to access the ID.
         */
        [HttpPost("request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] string recipientId)
        {
            var requestorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (requestorId == recipientId)
                return BadRequest("You cannot send a friend request to yourself.");

            var existing = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.RequestorId == requestorId && f.RecipientId == recipientId) ||
                (f.RequestorId == recipientId && f.RecipientId == requestorId));

            if (existing != null)
                return BadRequest("A friend request already exists.");

            var friendRequest = new Friends
            {
                RequestorId = requestorId,
                RecipientId = recipientId,
                TimeRequest = DateTime.UtcNow,
                Status = FriendshipStatus.Pending
            };

            _context.Friends.Add(friendRequest);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent.");
        }

        // POST: api/Friends/respond
        /* Uses the JWT token to access the ID.
         */
        [HttpPost("respond")]
        public async Task<IActionResult> RespondToRequest([FromBody] FriendResponseDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var request = await _context.Friends.FirstOrDefaultAsync(f =>
                f.RequestorId == dto.RequestorId && f.RecipientId == userId && f.Status == FriendshipStatus.Pending);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = dto.Accept ? FriendshipStatus.Accepted : FriendshipStatus.Ignored;
            await _context.SaveChangesAsync();

            return Ok($"Friend request {(dto.Accept ? "accepted" : "rejected")}.");
        }

        // GET: api/Friends/pending
        /* Uses the JWT token to access the ID.
         */
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var requests = await _context.Friends
                .Where(f => f.RecipientId == userId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Requestor)
                .ToListAsync();

            return Ok(requests);
        }

        // GET: api/Friends/list
        /* Uses the JWT token to access the ID.
         */
        [HttpGet("list")]
        public async Task<IActionResult> GetFriendsList()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friends = await _context.Friends
                .Where(f =>
                    (f.RequestorId == userId || f.RecipientId == userId) &&
                    f.Status == FriendshipStatus.Accepted)
                .Include(f => f.Requestor)
                .Include(f => f.Recipient)
                .ToListAsync();

            var result = friends.Select(f =>
                f.RequestorId == userId ? f.Recipient : f.Requestor);

            return Ok(result);
        }

        // DELETE: api/Friends/remove/{friendId}
        /* Uses the JWT token to access the ID.
         */
        [HttpDelete("remove/{friendId}")]
        public async Task<IActionResult> RemoveFriend(string friendId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var friendship = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.RequestorId == userId && f.RecipientId == friendId || f.RequestorId == friendId && f.RecipientId == userId)
                && f.Status == FriendshipStatus.Accepted);

            if (friendship == null)
                return NotFound("Friendship not found.");

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();

            return Ok("Friend removed.");
        }
    }

    public class FriendResponseDto
    {
        public string RequestorId { get; set; }
        public bool Accept { get; set; }
    }
}
