using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using System.Reflection.Emit;

namespace StudyVerseBackend.Infastructure.Contexts;

public class ApplicationDbContext
    : IdentityDbContext<User>
/*
 * This is the class where the Database context will reside, which is responsible for representing the
 * Tables as Models in C#.
 */
{
    public DbSet<CalendarEvent> CalendarEvents { get; set; }


    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<GravityBoosts> GravityBoosts { get; set; }

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

        builder.Entity<User>()
            .HasMany(e => e.Tasks)
            .WithOne(e => e.CurrentUser)

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
    }

}