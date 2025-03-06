using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StudyVerseBackend.Infastructure.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Load the environment variable
Env.Load("../.env");

string? connectionString = Env.GetString("DB_CONNECTION_STRING");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Database connection string is missing from the environment or the environment wasn't provided.");
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddHttpLogging(o => { });

// Add a service for logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Configure database
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

var app = builder.Build();
// app.UseHttpLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

Console.WriteLine("Hello World!");
app.UseHttpsRedirection();

app.MapGet("/hello", async (context) =>
{  
    app.Logger.LogInformation("/hello ENDPOINT");
    await context.Response.WriteAsync("Hello!");
});

app.Run();
