using System.Text;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Load the environment variable
Env.Load("../.env");

string? connectionString = Env.GetString("DB_CONNECTION_STRING");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Database connection string is missing from the environment or the environment wasn't provided.");
}

string? secret = Env.GetString("JWTCONFIG_SECRET") ??
                    throw new Exception("Missing JWT Secret key from environment for authenitication purposes.");
string? issuer = Env.GetString("JWTCONFIG_VALID_ISSUER") ?? 
                    throw new Exception("Missing the Issuer for authentication purposes.");
string audience = Env.GetString("JWTCONFIG_VALID_AUDIENCE") ??
                    throw new Exception("Missing the audience key for authentication purposes.");

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpLogging(o => { });

// Add a service for logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Configure database and user authentication section
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddDataProtection();

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configurations on authentication(associating with the Jwt)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidIssuer = issuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
});

var app = builder.Build();
// app.UseHttpLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Turn the auth related resources
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/hello", async (context) =>
{  
    app.Logger.LogInformation("/hello ENDPOINT");
    await context.Response.WriteAsync("Hello!");
});

app.Run();
