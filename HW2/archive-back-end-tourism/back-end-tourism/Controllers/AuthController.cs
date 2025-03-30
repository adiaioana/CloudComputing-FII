
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using back_end_tourism.Application;
using Domain.Entities;
using back_end_tourism.Application.Users;
using back_end_tourism.Services;

namespace back_end_tourism.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthController(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        // ✅ User Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var createdUser = await _userRepository.RegisterAsync(user);
            if (createdUser == null)
                return BadRequest(new { message = "User registration failed" });

            return Ok(new { message = "User registered successfully" });
        }

        // ✅ User Login & Token Generation
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.AuthenticateAsync(request.Email, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var token = _jwtService.GenerateToken(user);
            return Ok(new { token });
        }
    }

    // ✅ Login Request Model
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
