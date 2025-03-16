using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Entities
{


    public class Friends {
        [Required]
        [Key]
        public string UserId { get; set; }
        [Required]
        [Key]
        public string FriendId { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public DateTime TimeRequest { get; set; }
        
        public User Friend { get; set; }


        public User User { get; set; }

    }
}