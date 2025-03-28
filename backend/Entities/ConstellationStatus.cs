using StudyVerseBackend.Infastructure.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Entities
{
    public class ConstellationStatus
    {
        [Key]
        public int ConstellationStatusId { get; set; }

        public string User_id { get; set; }
        public User User { get; set; }

        public PlanetStatus OldPlanet { get; set; }
        public PlanetStatus NewPlanet { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    }
}
