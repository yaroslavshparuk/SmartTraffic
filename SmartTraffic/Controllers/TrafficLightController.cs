using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartTraffic.DAL.Models;
using SmartTraffic.Domain.Models;
using SmartTraffic.Domain.Services;

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
        public IActionResult Create(TrafficLightDto trafficLightDto)
        {
            return Ok(_mapper.Map<TrafficLightDto>(_trafficLightService.CreateAndGet(trafficLightDto)));
        }
    }
}