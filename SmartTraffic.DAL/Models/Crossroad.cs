namespace SmartTraffic.DAL.Models
{
    public class Crossroad
    {
        public int Id { get; set; }
        public int FirstStreetId { get; set; }
        public int SecondStreetId { get; set; }
    }
}
