using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Dependencies;
using StudyVerseBackend.Models.Authenticate;

namespace StudyVerseBackend.Controllers;

[ApiController]
[Route("api/authenticate")]
public class AccountController (UserManager<User> userManager, IEnvService env) : ControllerBase
{
    
    [HttpPost("signup")]
    public async Task<IActionResult> Register(RegistrationDto registrationDto)
    {
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
                ModelState.AddModelError("error", "Email is already being registered.");
                return BadRequest(ModelState);
            }

            var user = new User()
            {
                UserName = registrationDto.UserName,
                Email = registrationDto.Email,
                Name = registrationDto.Name,
                Avatar_Url = registrationDto.Avatar_Url,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            if (!String.IsNullOrEmpty(registrationDto.CustomizationOptions))
            {
                user.SetCustomizationSettings(registrationDto.CustomizationOptions);
            }
            
            // POST/create the object in the database
            var result = await userManager.CreateAsync(user, registrationDto.Password);

            if (result.Succeeded)
            {
                var token = GenerateToken(registrationDto.UserName, 
                    registrationDto.Email);
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
        bool isMissingIdentifier = ( !String.IsNullOrEmpty(loginDto.UserName)  || !String.IsNullOrEmpty(loginDto.UserName) );
        if (ModelState.IsValid && !isMissingIdentifier)
        {
            // If the user provided a username
            if (!String.IsNullOrEmpty(loginDto.UserName))
            {
                var user = userManager.FindByNameAsync(loginDto.UserName);
                if (user.Result != null)
                {
                    if (await userManager.CheckPasswordAsync(user.Result, loginDto.Password))
                    {
                        string? token = GenerateToken(user.Result.UserName, user.Result.Email);
                        return Accepted(new { token });
                    }
                } 
            }
            
            if (!String.IsNullOrEmpty(loginDto.Email))
            {
                var user = userManager.FindByEmailAsync(loginDto.Email);
                if (user.Result != null)
                {
                    if (await userManager.CheckPasswordAsync(user.Result, loginDto.Password))
                    {
                        string? token = GenerateToken(user.Result.UserName, user.Result.Email);
                        return Accepted(new { token });
                    }
                } 
            }
            
            ModelState.AddModelError("error", "Invalid email/username or password.");
        }

        if (!isMissingIdentifier)
        {
            ModelState.AddModelError("error","Missing username or email. Cannot proceed with authentication." );
        }

        return BadRequest(ModelState);
    }


    private string? GenerateToken(string userName, string email)
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
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Email, email)
            }),
            // Set the token to expire one day later, will be changed later
            Expires = DateTime.UtcNow.AddDays(1),
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