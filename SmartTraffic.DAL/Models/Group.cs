namespace SmartTraffic.DAL.Models
{
    public class Group
    {
        public int Id { get; set; }
        public int GroupTypeId { get; set; }
        public virtual GroupType GroupType { get; set; }
        public virtual ICollection<TrafficLight> TrafficLights { get; set; }
    }
}
