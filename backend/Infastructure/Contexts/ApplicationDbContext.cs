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
    public DbSet<Task> Tasks { get; set; }

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
         * Configuration with Enum
         */
        builder.Entity<Friends>()
            .Property(f => f.Status)
            .HasConversion<int>();
        
        /*
         * COnfigurations with the friends table
         */
        builder.Entity<Friends>()
            .HasKey(f => new { f.RequestorId, f.RecipientId });
        
        builder.Entity<Friends>()
            .HasOne(fr => fr.Requestor)
            .WithMany()
            .HasForeignKey(fr => fr.RequestorId);

        builder.Entity<Friends>()
            .HasOne(fr => fr.Recipient)
            .WithMany()
            .HasForeignKey(fr => fr.RecipientId);

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
    }
}
