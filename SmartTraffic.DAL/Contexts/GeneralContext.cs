using Microsoft.EntityFrameworkCore;
using SmartTraffic.DAL.Models;

namespace SmartTraffic.DAL.Contexts
{
    public class GeneralContext : DbContext
    {
        public DbSet<TrafficLight> TrafficLights { get; set; }

        public GeneralContext()
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=smarttraffic;Trusted_Connection=True;");
        }
    }
}
