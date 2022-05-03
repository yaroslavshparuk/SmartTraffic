using Microsoft.EntityFrameworkCore;
using SmartTraffic.DAL.Contexts;
using SmartTraffic.Domain.Enums;
using SmartTraffic.Domain.Models;

namespace SmartTraffic.Domain.Services
{
    public class TrafficDataService
    {

        public Density GetDensity(int streetId)
        {
            using (var ctx = new GeneralContext())
            {
                var group = ctx.Groups.Include(x => x.TrafficLights).FirstOrDefault(x => x.Id == streetId);

                var first = group.TrafficLights.FirstOrDefault();
                var point1 = new Point(first.DirectionControlLatitude, first.DirectionControlLongitude);

                var second = group.TrafficLights.LastOrDefault();
                var point2 = new Point(first.Latitude, first.Longitude);

                if (second != null)
                {
                    point2 = new Point(second.DirectionControlLatitude, second.DirectionControlLongitude);
                }

                return GetDensity(point1, point2, Density.None);
            }
        }

        private Density GetDensity(Point point1, Point point2, Density defaultValue)
        {
            // call some api to define density on street
            return defaultValue;
        }
    }
}
