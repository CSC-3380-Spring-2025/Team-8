using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;

namespace StudyVerseBackend.Infastructure.Contexts;

public class ApplicationDbContext
    : IdentityDbContext<User>
/*
 * This is the class where the Database context will reside, which is responsible for representing the
 * Tables as Models in C#.
 */
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<GravityBoosts> GravityBoosts { get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();

        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        builder.Entity<User>()
            .Property(u => u.CustomizationOptions)
            .HasColumnType("jsonb");
    }

}