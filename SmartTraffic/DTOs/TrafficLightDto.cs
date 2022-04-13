namespace SmartTraffic.DTOs
{
    public class TrafficLightDto
    {
        public int Id { get; set; }
        public int OppositeId { get; set; }
        public int DublicateId { get; set; }
        public Point Location { get; set; }
        public Point DirectionControl { get; set; }
        public bool HasStraightAdjustmen { get; set; }
        public bool HasLeftAdjustmen { get; set; }
        public bool HasRightAdjustmen { get; set; }
    }
}
