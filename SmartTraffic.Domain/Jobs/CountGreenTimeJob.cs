using Coravel.Invocable;
using SmartTraffic.DAL.Contexts;
using SmartTraffic.Domain.Enums;
using SmartTraffic.Domain.Services;

namespace SmartTraffic.Domain.Jobs
{
    public class CountGreenTimeJob : IInvocable
    {
        private readonly MQTTService _mqqtService;
        private readonly TrafficDataService _trafficDataService;

        public CountGreenTimeJob(MQTTService mqqtService, TrafficDataService trafficDataService)
        {
            _mqqtService = mqqtService;
            _trafficDataService = trafficDataService;
        }

        public async Task Invoke()
        {
            using (var ctx = new GeneralContext())
            {
                foreach (var crossroad in ctx.Crossroads)
                {
                    var firstStreetDensity = _trafficDataService.GetDensity(crossroad.FirstStreetId);
                    var secondStreetDensity = _trafficDataService.GetDensity(crossroad.FirstStreetId);

                    var beatDuration = BeatDuration.None;

                    if (firstStreetDensity > secondStreetDensity)
                    {
                        beatDuration = BeatDuration.Increase;
                    }

                    else if (firstStreetDensity < secondStreetDensity)
                    {
                        beatDuration = BeatDuration.Lower;
                    }

                    await _mqqtService.Send(beatDuration.ToString(), "crossroad_" + crossroad.Id);
                }
            }
        }
    }
}
