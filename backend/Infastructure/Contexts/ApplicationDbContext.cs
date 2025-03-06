using Microsoft.EntityFrameworkCore;

namespace StudyVerseBackend.Infastructure.Contexts;

public class ApplicationDbContext: DbContext
/*
 * This is the class where the Database context will reside, which is responsible for representing the
 * Tables as Models in C#.
 */
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
}