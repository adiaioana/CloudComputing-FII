
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace back_end_tourism.Controllers
{

    [Authorize]  // ⬅ Protected with JWT
    [Route("api/secure")]
    [ApiController]
    public class SecureController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSecureData()
        {
            return Ok(new { message = "You have access to secured data!" });
        }
    }

}
