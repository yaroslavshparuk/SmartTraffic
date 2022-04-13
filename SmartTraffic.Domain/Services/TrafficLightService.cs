using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SmartTraffic.DAL.Contexts;
using SmartTraffic.DAL.Models;
using SmartTraffic.Domain.Models;

namespace SmartTraffic.Domain.Services
{
    public class TrafficLightService
    {
        private readonly Mapper _mapper = new Mapper(new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<TrafficLightDto, TrafficLight>()
               .ForMember(dest => dest.Latitude, act => act.MapFrom(src => src.Location.Latitude))
               .ForMember(dest => dest.Longitude, act => act.MapFrom(src => src.Location.Longitude))
               .ForMember(dest => dest.DirectionControlLatitude, act => act.MapFrom(src => src.DirectionControl.Latitude))
               .ForMember(dest => dest.DirectionControlLongitude, act => act.MapFrom(src => src.DirectionControl.Longitude));
        }));
        public IEnumerable<TrafficLight> GetAll()
        {
            using (var ctx = new GeneralContext())
            {
                return ctx.TrafficLights.ToArray();
            }
        }

        public TrafficLight CreateAndGet(TrafficLightDto trafficLightDto)
        {
            using (var ctx = new GeneralContext())
            {
                var group = new TrafficLightGroup();

                if (trafficLightDto.DublicateId is not null)
                {
                    group = GetGroupByTrafficLightId(trafficLightDto.DublicateId);
                }

                if (trafficLightDto.OppositeId is not null && group.OppositeGroupId is null)
                {
                    group.OppositeGroupId = GetGroupByTrafficLightId(trafficLightDto.OppositeId).Id;
                }

                if (group.Id is not 0)
                {
                    ctx.TrafficLightGroups.Update(group);
                }
                else
                {
                    ctx.TrafficLightGroups.Add(group);
                }

                ctx.SaveChanges();

                if (group.OppositeGroupId is not null)
                {
                    var oppositeGroup = ctx.TrafficLightGroups.FirstOrDefault(x => x.Id == group.OppositeGroupId);
                    oppositeGroup.OppositeGroupId = group.Id;
                    ctx.Update(oppositeGroup);
                }

                var trafficLight = _mapper.Map<TrafficLight>(trafficLightDto);
                trafficLight.TrafficLightGroupId = group.Id;
                ctx.TrafficLights.Add(trafficLight);
                ctx.SaveChanges();

                return trafficLight;
            }
        }

        private TrafficLightGroup GetGroupByTrafficLightId(int? id)
        {
            using (var ctx = new GeneralContext())
            {
                return ctx.TrafficLights.Include(x => x.TrafficLightGroup).FirstOrDefault(x => x.Id == id).TrafficLightGroup;
            }
        }
    }
}
