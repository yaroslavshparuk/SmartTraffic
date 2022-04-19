namespace SmartTraffic.DAL.Models
{
    public class GroupType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Group> Groups { get; set; }
    }
}
