namespace SmartTraffic.DAL.Models
{
    public class TrafficLight
    {
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double DirectionControlLatitude { get; set; }
        public double DirectionControlLongitude { get; set; }
        public bool HasStraightAdjustmen { get; set; }
        public bool HasLeftAdjustmen { get; set; }
        public bool HasRightAdjustmen { get; set; }
    }
}
