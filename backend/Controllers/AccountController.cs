using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Interfaces;
using StudyVerseBackend.Models.Authenticate;
using StudyVerseBackend.Models.Friends;

namespace StudyVerseBackend.Controllers;

[ApiController]
[Route("api/authenticate")]
public class AccountController(UserManager<User> userManager, IEnvService env, ApplicationDbContext context) : ControllerBase
{

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromForm] RegistrationDto registrationDto)
    {
        TextInfo myTI = new CultureInfo("en-US", false).TextInfo;
        if (ModelState.IsValid)
        {
            // This code verifies the email and username have not been taken.
            var existedUser = await userManager.FindByNameAsync(registrationDto.UserName);
            if (existedUser != null)
            {
                ModelState.AddModelError("error", "Username is already taken.");
                return BadRequest(ModelState);
            }

            existedUser = await userManager.FindByEmailAsync(registrationDto.Email);
            if (existedUser != null)
            {
                ModelState.AddModelError("error", "Email is already registered.");
                return BadRequest(ModelState);
            }

            var user = new User()
            {
                UserName = registrationDto.UserName,
                Email = registrationDto.Email,
                Name = myTI.ToTitleCase(registrationDto.Name),
                Avatar_Url = registrationDto.Avatar_Url,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            if (!String.IsNullOrEmpty(registrationDto.CustomizationOptions))
            {
                user.SetCustomizationSettings(registrationDto.CustomizationOptions);
            }

            // POST/create the object in the database
            var result = await userManager.CreateAsync(user, registrationDto.Password);

            var signedInUser = await userManager.FindByEmailAsync(registrationDto.Email);

            if (result.Succeeded && signedInUser != null)
            {
                var token = GenerateToken(registrationDto.Email, signedInUser.Id);
                return Ok(new { token });
            }

            // this adds errors
            foreach (IdentityError error in result.Errors)
            {
                if (error.Code.Contains("Password"))
                {
                    ModelState.AddModelError("passwordValidationError", error.Description);
                }
                else
                {
                    ModelState.AddModelError("error", error.Description);
                }
            }
        }

        return BadRequest(ModelState);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        /*
         * Users will have the option to provide a email or username, if neither is provided then a error should be thrown
         */
        bool isMissingIdentifier = (!String.IsNullOrEmpty(loginDto.UserName) || !String.IsNullOrEmpty(loginDto.UserName));
        if (ModelState.IsValid && !isMissingIdentifier)
        {
            // If the user provided a username
            if (!String.IsNullOrEmpty(loginDto.UserName))
            {
                var user = await userManager.FindByNameAsync(loginDto.UserName);
                if (user != null)
                {
                    if (await userManager.CheckPasswordAsync(user, loginDto.Password))
                    {
                        string? token = GenerateToken(user.Email, user.Id);
                        return Accepted(new { token });
                    }
                }
            }

            if (!String.IsNullOrEmpty(loginDto.Email))
            {
                var user = await userManager.FindByEmailAsync(loginDto.Email);
                if (user != null)
                {
                    if (await userManager.CheckPasswordAsync(user, loginDto.Password))
                    {
                        string? token = GenerateToken(user.Email, user.Id);
                        return Accepted(new { token });
                    }
                    else
                    {
                        ModelState.AddModelError("error", "No user found with this email and password combo.");
                    }
                }
                else
                {
                    ModelState.AddModelError("error", "User not found with this email. Please create an account.");
                }
            }


        }

        if (isMissingIdentifier)
        {
            ModelState.AddModelError("error", "Missing username or email. Cannot proceed with authentication.");
        }

        return BadRequest(ModelState);
    }

    [HttpGet("verify")]
    // Endpoint request: .../api/authenticate/verify?Field=Email&Value=YESSIR
    public async Task<IActionResult> Verify([FromQuery] VerifyField verifyFields)
    {
        if (!verifyFields.Field.Equals("Email") && !verifyFields.Field.Equals("Username"))
        {
            ModelState.AddModelError("error", "Missing email or username as a search query.");
            return BadRequest(ModelState);
        }

        bool isValid = false;

        if (verifyFields.Field.Equals("Email"))
        {
            User? user = await userManager.FindByEmailAsync(verifyFields.Value);
            if (user == null)
            {
                isValid = true;
            }
        }
        else
        {
            User? user = await userManager.FindByNameAsync(verifyFields.Value);
            if (user == null)
            {
                isValid = true;
            }
        }


        return Ok(new { isValid });
    }

    [HttpGet("search")]
    // GET: /api/authenticate/search?username=[username]
    public async Task<ActionResult<IEnumerable<UserFriendRes>>> SearchByUserName([FromQuery] string username)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            var allUsers = await userManager.Users
                .OrderBy(u => u.NormalizedUserName)
                .Take(5)
                .Select(u => new UserFriendRes
                {
                    Id = u.Id,
                    Name = u.Name,
                    Username = u.UserName,
                    Planet = u.PlanetStatus.ToString(),
                    AvatarUrl = u.Avatar_Url
                })
                .ToListAsync();

            return Ok(allUsers);
        }

        string normalizedUsername = username.ToUpper();

        var users = await userManager.Users
            .Where(u => u.NormalizedUserName.StartsWith(normalizedUsername))
            .Take(5)
            .Select(u => new UserFriendRes
            {
                Id = u.Id,
                Name = u.Name,
                Username = u.UserName,
                Planet = u.PlanetStatus.ToString(),
                AvatarUrl = u.Avatar_Url
            })
            .ToListAsync();

        return Ok(users);
    }
    
    [HttpGet("profile")]
    public async Task<IActionResult> GetCurrentUserProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("Missing authentication token");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var profile = new ProfileResDto
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.UserName,
            Email = user.Email,
            AvatarUrl = user.Avatar_Url,
            Planet = user.PlanetStatus.ToString(),
        };

        return Ok(profile);
    }

    [HttpDelete("delete-account")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("Missing authentication token");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Delete related entities (e.g., PomodoroSessions, Friends, etc.)
        var pomodoroSessions = await context.PomodoroSessions
            .Where(ps => ps.UserId == userId)
            .ToListAsync();
        context.PomodoroSessions.RemoveRange(pomodoroSessions);

        var friendships = await context.Friends
            .Where(f => f.RequestorId == userId || f.RecipientId == userId)
            .ToListAsync();
        context.Friends.RemoveRange(friendships);
        
        var calendarEvents = await context.CalendarEvents
            .Where(ce => ce.UserId == userId)
            .ToListAsync();
        context.CalendarEvents.RemoveRange(calendarEvents);
        
        var tasks = await context.Tasks
            .Where(t => t.UserId == userId)
            .ToListAsync();
        context.Tasks.RemoveRange(tasks);
        
        var galaxyBoosts = await context.GravityBoosts
            .Where(gb => gb.Receiver_Id == userId || gb.Sender_Id == userId)
            .ToListAsync();
        context.GravityBoosts.RemoveRange(galaxyBoosts);
        
        await context.SaveChangesAsync();
        
        var result = await userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest("Failed to delete the account.");
        }

        return Ok("Account and related data deleted successfully.");
    }


    private string? GenerateToken(string email, string userId)
    {
        string secret = Env.GetString("JWTCONFIG_SECRET");
        string issuer = Env.GetString("JWTCONFIG_VALID_ISSUER");
        string audience = Env.GetString("JWTCONFIG_VALID_AUDIENCE");

        SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
            }),
            // Set the token to expire thirty day later, will be changed later
            Expires = DateTime.UtcNow.AddDays(30),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature)
        };

        // the part that actually generates the token
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);
        return token;
    }
}