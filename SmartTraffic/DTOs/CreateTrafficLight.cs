namespace SmartTraffic.DTOs
{
    public class CreateTrafficLight
    {
        public int Id { get; set; }
        public Point Location { get; set; }
        public Point DirectionControl { get; set; }
        public bool HasStraightAdjustmen { get; set; }
        public bool HasLeftAdjustmen { get; set; }
        public bool HasRightAdjustmen { get; set; }
    }
}
