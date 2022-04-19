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
                var group = new Group();

                if (trafficLightDto.DublicateId is not null && trafficLightDto.DublicateId is not 0)
                {
                    group = GetGroupByTrafficLightId(trafficLightDto.DublicateId);
                }

                if (group.Id is 0)
                {
                    group.GroupTypeId = ctx.GroupTypes.First(x => x.Name == "Traffic light").Id;
                    ctx.Groups.Add(group);
                    ctx.SaveChanges();
                }

                if (trafficLightDto.OppositeId is not null && trafficLightDto.OppositeId is not 0 && 
                    !ctx.OppositeGroups.Any(x => x.OppositeGroupId == trafficLightDto.OppositeId || x.MainGroupId == trafficLightDto.OppositeId))
                {
                    ctx.OppositeGroups.Add(
                        new OppositeGroup
                        {
                            MainGroupId = group.Id,
                            OppositeGroupId = GetGroupByTrafficLightId(trafficLightDto.OppositeId).Id
                        });
                }

                var trafficLight = _mapper.Map<TrafficLight>(trafficLightDto);
                trafficLight.GroupId = group.Id;
                ctx.TrafficLights.Add(trafficLight);
                ctx.SaveChanges();

                return trafficLight;
            }
        }

        private Group GetGroupByTrafficLightId(int? id)
        {
            using (var ctx = new GeneralContext())
            {
                return ctx.TrafficLights.Include(x => x.Group).FirstOrDefault(x => x.Id == id).Group;
            }
        }
    }
}
