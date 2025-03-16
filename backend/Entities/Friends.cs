using System.ComponentModel.DataAnnotations;
using StudyVerseBackend.Infastructure.Enumerations;

namespace StudyVerseBackend.Entities
{


    public class Friends {
        [Required]
        public string RequestorId { get; set; }
        [Required]
        public string RecipientId { get; set; }

        [Required] 
        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        [Required]
        public DateTime TimeRequest { get; set; }
        
        public User Requestor { get; set; }


        public User Recipient { get; set; }

    }
}