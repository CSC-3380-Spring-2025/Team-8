using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Enumerations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models.Friends;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using StudyVerseBackend.Models.Tasks;

namespace StudyVerseBackend.Controllers
{
    [ApiController]
    [Authorize]
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
        public async Task<IActionResult> SendFriendRequest([FromQuery] string recipientId)
        {
            var requestorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (requestorId is null or "")
            {
                return Unauthorized("Missing authentication token");
            }

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

            if (userId is null or "")
            {
                return Unauthorized("Missing authentication token");
            }

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

            if (userId is null or "")
            {
                return Unauthorized("Missing authentication token");
            }

            var requests = await _context.Friends
                .Where(f => f.RecipientId == userId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Requestor)
                .Include(f => f.Recipient)
                .Select(f => f.RequestorId == userId ? f.Recipient : f.Requestor)
                .Select(friend => new UserFriendRes
                {
                    Id = friend.Id,
                    Name = friend.Name,
                    Username = friend.UserName,
                    Planet = friend.PlanetStatus.ToString(),
                    AvatarUrl = friend.Avatar_Url
                })
                .ToListAsync();

            return Ok(requests);
        }

        // POST: api/Friends/accept?recipientId={id}
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromQuery] string recipientId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Missing authentication token");
            }

            var request = await _context.Friends.FirstOrDefaultAsync(f =>
                f.RequestorId == recipientId && f.RecipientId == userId && f.Status == FriendshipStatus.Pending);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = FriendshipStatus.Accepted;
            await _context.SaveChangesAsync();

            return Ok("Friend request accepted.");
        }

        // POST: api/Friends/ignore?recipientID={id}
        [HttpPost("ignore")]
        public async Task<IActionResult> IgnoreFriendRequest([FromQuery] string recipientID)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Missing authentication token");
            }

            var request = await _context.Friends.FirstOrDefaultAsync(f =>
                f.RequestorId == recipientID && f.RecipientId == userId && f.Status == FriendshipStatus.Pending);

            if (request == null)
                return NotFound("Friend request not found.");

            request.Status = FriendshipStatus.Ignored;
            await _context.SaveChangesAsync();

            return Ok("Friend request ignored.");
        }

        // GET: api/Friends/list
        /* Uses the JWT token to access the ID.
         */
        [HttpGet("list")]
        public async Task<IActionResult> GetFriendsList()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null or "")
            {
                return Unauthorized("Missing authentication token");
            }

            var allFriendsResult = await _context.Friends
                .Where(f =>
                    (f.RequestorId == userId || f.RecipientId == userId) &&
                    f.Status == FriendshipStatus.Accepted)
                .Include(f => f.Requestor)
                .Include(f => f.Recipient)
                .Select(f => f.RequestorId == userId ? f.Recipient : f.Requestor)
                .Select(friend => new UserFriendRes
                {
                    Id = friend.Id,
                    Name = friend.Name,
                    Username = friend.UserName,
                    Planet = friend.PlanetStatus.ToString(),
                    AvatarUrl = friend.Avatar_Url
                })
                .ToListAsync();

            return Ok(allFriendsResult);
        }

        // DELETE: api/Friends/remove/{friendId}
        /* Uses the JWT token to access the ID.
         */
        [HttpDelete("remove/{friendId}")]
        public async Task<IActionResult> RemoveFriend(string friendId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null or "")
            {
                return Unauthorized("Missing authentication token");
            }

            var friendship = await _context.Friends.FirstOrDefaultAsync(f =>
                (f.RequestorId == userId && f.RecipientId == friendId || f.RequestorId == friendId && f.RecipientId == userId)
                && f.Status == FriendshipStatus.Accepted);

            if (friendship == null)
                return NotFound("Friendship not found.");

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();

            return Ok("Friend removed.");
        }

        // GET: api/task/friends/activity
        [HttpGet("friends/recent-completed")]
        public async Task<ActionResult<IEnumerable<TaskActivityView>>> GetFriendsRecentCompletedTasks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("Missing JWT token in header.");
            }

            // Get all accepted friends
            var friendIds = await _context.Friends
                .Where(f =>
                    (f.RequestorId == userId || f.RecipientId == userId) &&
                    f.Status == FriendshipStatus.Accepted)
                .Select(f => f.RequestorId == userId ? f.RecipientId : f.RequestorId)
                .ToListAsync();

            // Get top 8 recently completed tasks by those friends
            var recentCompletedTasks = await _context.Tasks
                .Where(t => t.IsCompleted && t.CompletedAt != null && friendIds.Contains(t.UserId))
                .OrderByDescending(t => t.CompletedAt)
                .Take(8)
                .Select(t => new TaskActivityView
                {
                    Username = t.CurrentUser.UserName,
                    Name = t.CurrentUser.Name,
                    Title = t.Title,
                    CompletedAt = t.CompletedAt.Value
                })
                .ToListAsync();

            return Ok(recentCompletedTasks);
        }



        public class FriendResponseDto
        {
            public string RequestorId { get; set; }
            public bool Accept { get; set; }
        }
    }
}
