using SmartTraffic.DAL.Contexts;
using SmartTraffic.DAL.Models;

namespace SmartTraffic.Domain.Services
{
    public class TrafficLightService
    {
        public IEnumerable<TrafficLight> GetAll()
        {
            using (var context = new GeneralContext())
                return context.TrafficLights.ToArray();
        }

        public TrafficLight Get(int id)
        {
            using (var context = new GeneralContext())
                return context.TrafficLights.FirstOrDefault(x => x.Id == id);
        }

        public TrafficLight CreateAndGet(TrafficLight trafficLight)
        {
            using (var context = new GeneralContext())
            {
                if(trafficLight.DublicateId is not 0)
                {
                    var dublicate = Get(trafficLight.DublicateId);
                    dublicate.DublicateId = trafficLight.Id;
                    context.TrafficLights.Update(dublicate);
                }

                if (trafficLight.OppositeId is not 0)
                {
                    var opposite = Get(trafficLight.OppositeId);
                    opposite.OppositeId = trafficLight.Id;
                    context.TrafficLights.Update(opposite);
                }

                context.TrafficLights.Add(trafficLight);
                context.SaveChanges();
                return trafficLight;
            }
        }
    }
}
