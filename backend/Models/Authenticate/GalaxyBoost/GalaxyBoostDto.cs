namespace StudyVerseBackend.Models.GalaxyBoost
{
    public class GalaxyBoostPostDto
    {
        public string receiver_id { get; set; }
        public string message { get; set; }

    }

    public class GalaxyBoostRes
    {
        public int Boost_Id { get; set; }
        public string sender_id { get; set; }
        public string sender_name { get; set; }
        public string receiver_id { get; set; }
        public string message { get; set; }
        public DateTime sent_at { get; set; }
    }
}
