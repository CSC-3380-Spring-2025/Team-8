using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;

namespace StudyVerseBackend.Infastructure.Contexts;

public class ApplicationDbContext
    : IdentityDbContext<User>
{
    /*
     * This is the class where the Database context will reside, which is responsible for representing the
     * Tables as Models in C#.
     */


    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<CalendarEvent> CalendarEvents { get; set; }
    public DbSet<Friends> Friends { get; set; }
    public DbSet<PomodoroSession> PomodoroSessions { get; set; }
    public DbSet<GravityBoosts> GravityBoosts { get; set; }
    public DbSet<Tasks> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configuring relationships with users
        builder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();

        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        builder.Entity<User>()
            .Property(u => u.CustomizationOptions)
            .HasColumnType("jsonb");

        /*
         * Configuration with Enums
         */
        builder.Entity<Friends>()
            .Property(f => f.Status)
            .HasConversion<int>();

        builder.Entity<User>()
            .Property(user => user.PlanetStatus)
            .HasConversion<int>();

        builder.Entity<ConstellationStatus>()
            .Property(con => con.OldPlanet)
            .HasConversion<int>();

        builder.Entity<ConstellationStatus>()
            .Property(con => con.NewPlanet)
            .HasConversion<int>();

        /*
         * COnfigurations with the friends table
         */
        builder.Entity<Friends>()
            .HasKey(f => new { f.RequestorId, f.RecipientId });

        builder.Entity<Friends>()
            .HasOne(fr => fr.Requestor)
            .WithMany(u => u.FriendRequestsSent)
            .HasForeignKey(fr => fr.RequestorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Friends>()
            .HasOne(fr => fr.Recipient)
            .WithMany(u => u.FriendRequestsReceived)
            .HasForeignKey(fr => fr.RecipientId)
            .OnDelete(DeleteBehavior.NoAction);

        // Code dealing with GravityBoosts
        builder.Entity<GravityBoosts>()
            .HasOne(gb => gb.Sender)
            .WithMany()
            .HasForeignKey(gb => gb.Sender_Id);

        builder.Entity<GravityBoosts>()
            .HasOne(gb => gb.Receiver)
            .WithMany()
            .HasForeignKey(gb => gb.Receiver_Id);
        /*
         * This code creates the following relationship:
         * A user can have many events, but a event must HAVE one user
         */
        builder.Entity<User>()
            .HasMany(e => e.CalendarEvents)
            .WithOne(e => e.User)

            .HasForeignKey(e => e.UserId)
            .IsRequired();

        /*
         * A user can have many sessions but a pomodoro session must have one user
         */
        builder.Entity<User>()
            .HasMany(user => user.PomodoroSessions)
            .WithOne(ps => ps.CurrentUser)
            .HasForeignKey(ps => ps.UserId)
            .IsRequired();

        /*
         * A user can have many tasks, but a task can have only one user
         */
        builder.Entity<User>()
            .HasMany(e => e.Tasks)
            .WithOne(e => e.CurrentUser);

        /*
         * A user can have many constellation status changes
         */
        builder.Entity<User>()
            .HasMany(e => e.ConstellationStatuses)
            .WithOne(e => e.User);
    }
}
