using Microsoft.AspNetCore.Mvc;

namespace SmartTraffic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return string.Empty;
        }
    }
}