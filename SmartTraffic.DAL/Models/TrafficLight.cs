namespace SmartTraffic.DAL.Models
{
    public class TrafficLight
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double DirectionControlLatitude { get; set; }
        public double DirectionControlLongitude { get; set; }
        public bool IsAuto { get; set; }
        public virtual Group Group { get; set; }
    }
}
