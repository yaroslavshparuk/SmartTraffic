using Microsoft.EntityFrameworkCore;
using SmartTraffic.DAL.Models;

namespace SmartTraffic.DAL.Contexts
{
    public class GeneralContext : DbContext
    {
        public DbSet<TrafficLight> TrafficLights { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupType> GroupTypes { get; set; }
        public DbSet<OppositeGroup> OppositeGroups { get; set; }

        public GeneralContext()
        {
            Database.EnsureCreated();
            if (!OppositeGroups.Any())
            {
                Add(new GroupType { Name = "Traffic light" });
                SaveChanges();
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=smarttraffic;Trusted_Connection=True;");
        }
    }
}
