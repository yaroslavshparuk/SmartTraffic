using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartTraffic.DAL.Models;
using SmartTraffic.Domain.Services;
using SmartTraffic.DTOs;

namespace SmartTraffic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrafficLightController : ControllerBase
    {
        private readonly TrafficLightService _trafficLightService;
        private readonly Mapper _mapper = new Mapper(new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<TrafficLight, TrafficLightDto>()
               .ForMember(dest => dest.Location, act => act.MapFrom(src => new Point { Latitude = src.Latitude, Longitude = src.Longitude }))
               .ForMember(dest => dest.DirectionControl, act => act.MapFrom(src => new Point { Latitude = src.DirectionControlLatitude, Longitude = src.DirectionControlLongitude }));
            cfg.CreateMap<TrafficLightDto, TrafficLight>()
               .ForMember(dest => dest.Latitude, act => act.MapFrom(src => src.Location.Latitude))
               .ForMember(dest => dest.Longitude, act => act.MapFrom(src => src.Location.Longitude))
               .ForMember(dest => dest.DirectionControlLatitude, act => act.MapFrom(src => src.DirectionControl.Latitude))
               .ForMember(dest => dest.DirectionControlLongitude, act => act.MapFrom(src => src.DirectionControl.Longitude));
        }));

        public TrafficLightController(TrafficLightService trafficLightService)
        {
            _trafficLightService = trafficLightService;
        }

        [Route("GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_trafficLightService.GetAll().Select(x => _mapper.Map<TrafficLightDto>(x)));
        }

        [Route("Create")]
        [HttpPost]
        public IActionResult Create(TrafficLightDto trafficLight)
        {
            var newTrafficLight = _trafficLightService.CreateAndGet(_mapper.Map<TrafficLight>(trafficLight));
            return Ok(_mapper.Map<TrafficLightDto>(newTrafficLight));
        }
    }
}