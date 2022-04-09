using Microsoft.AspNetCore.Mvc;
using SmartTraffic.DTOs;

namespace SmartTraffic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrafficLightController : ControllerBase
    {
        [Route("Create")]
        [HttpPost]
        public IActionResult Create(TrafficLightDTO trafficLight)
        {
            return Ok();
        }
    }
}