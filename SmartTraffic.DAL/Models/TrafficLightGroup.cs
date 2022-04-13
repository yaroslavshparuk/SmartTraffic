namespace SmartTraffic.DAL.Models
{
    public class TrafficLightGroup
    {
        public int Id { get; set; }
        public int? OppositeGroupId { get; set; }
        public ICollection<TrafficLight> TrafficLights { get; set; }
    }
}
