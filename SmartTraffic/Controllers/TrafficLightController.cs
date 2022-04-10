using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartTraffic.DAL.Contexts;
using SmartTraffic.DAL.Models;
using SmartTraffic.DTOs;

namespace SmartTraffic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrafficLightController : ControllerBase
    {
        private readonly Mapper _mapper = new Mapper(new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<TrafficLight, CreateTrafficLight>()
               .ForMember(dest => dest.Location, act => act.MapFrom(src => new Point { Latitude = src.Latitude, Longitude = src.Longitude }))
               .ForMember(dest => dest.DirectionControl, act => act.MapFrom(src => new Point { Latitude = src.DirectionControlLatitude, Longitude = src.DirectionControlLongitude }));
            cfg.CreateMap<CreateTrafficLight, TrafficLight>()
               .ForMember(dest => dest.Latitude, act => act.MapFrom(src => src.Location.Latitude))
               .ForMember(dest => dest.Longitude, act => act.MapFrom(src => src.Location.Longitude))
               .ForMember(dest => dest.DirectionControlLatitude, act => act.MapFrom(src => src.DirectionControl.Latitude))
               .ForMember(dest => dest.DirectionControlLongitude, act => act.MapFrom(src => src.DirectionControl.Longitude));
        }));

        [Route("GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            using (var context = new GeneralContext())
                return Ok(context.TrafficLights.ToArray().Select(x => _mapper.Map<CreateTrafficLight>(x)));
        }

        [Route("Create")]
        [HttpPost]
        public IActionResult Create(CreateTrafficLight trafficLight)
        {
            using (var context = new GeneralContext())
            {
                context.TrafficLights.Add(_mapper.Map<TrafficLight>(trafficLight));
                context.SaveChanges();
            }
            return Ok();
        }
    }
}