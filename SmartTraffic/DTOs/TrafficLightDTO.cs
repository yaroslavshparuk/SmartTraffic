namespace SmartTraffic.DTOs
{
    public class TrafficLightDTO
    {
        public Point Location { get; set; }
        public Point DirectionControl { get; set; }
        public IEnumerable<string>? AdjustmentDirection { get; set; }
    }
}
