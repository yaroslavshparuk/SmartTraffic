namespace SmartTraffic.Domain.Models
{
    public class TrafficLightDto
    {
        public int Id { get; set; }
        public Point Location { get; set; }
        public Point DirectionControl { get; set; }
        public int? DublicateId { get; set; }
        public int? OppositeId { get; set; }
        public bool IsAuto { get; set; }
    }
}
