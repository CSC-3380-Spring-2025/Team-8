using System.ComponentModel.DataAnnotations;

namespace StudyVerseBackend.Entities;

public class GravityBoosts
{
    [Key]
    public int Boost_Id { get; set; }
    [Required]
    public string Message { get; set; }
    public DateTimeOffset Sent_At { get; set; } = DateTimeOffset.Now;
    [Required]
    public String Sender_Id { get; set; }
    public User Sender { get; set; }
    [Required]
    public String Receiver_Id { get; set; }
    public User Receiver { get; set; }
}