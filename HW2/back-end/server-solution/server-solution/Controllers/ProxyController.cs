using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server_solution.Services;
using server_solution.DTOs;

[ApiController]
[Route("[controller]")]
public class ProxyController : ControllerBase
{
    private readonly ProxyService _proxyService;

    public ProxyController(ProxyService proxyService)
    {
        _proxyService = proxyService;
    }

    // Publicly accessible GET endpoints
    [HttpGet("attractions")]
    [AllowAnonymous]
    public Task<IActionResult> GetAttractions() => _proxyService.ForwardRequest(Request, "/attractions", HttpMethod.Get);

    [HttpGet("attractions/{id}")]
    [AllowAnonymous]
    public Task<IActionResult> GetAttractionById(Guid id) => _proxyService.ForwardRequest(Request, $"/attractions/{id}", HttpMethod.Get);

    [HttpGet("museum")]
    [AllowAnonymous]
    public Task<IActionResult> GetMuseums() => _proxyService.ForwardRequest(Request, "/museum", HttpMethod.Get);

    [HttpGet("locations")]
    [AllowAnonymous]
    public Task<IActionResult> GetLocations() => _proxyService.ForwardRequest(Request, "/locations", HttpMethod.Get);

    // Protected Endpoints (Require Authentication)
    [HttpPost("attractions")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateAttraction([FromBody] CreateAttractionDto createDto)
    {
        var attraction = new AttractionDto
        {
            Name = createDto.Name,
            Location = createDto.Location,
            Category = createDto.Category,
            Description = createDto.Description,
            Rating = createDto.Rating,
            OpeningHours = createDto.OpeningHours,
            EntryFee = createDto.EntryFee
        };

        return await _proxyService.ForwardJsonRequest(Request, "/attractions", HttpMethod.Post, attraction);
    }

    [HttpPut("attractions/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateAttraction(Guid id, [FromBody] UpdateAttractionDto updateDto)
    {
        // You can choose to check and map the fields if needed, or just forward as is
        var attraction = new AttractionDto
        {
            Id = id,
            Name = updateDto.Name,
            Location = updateDto.Location,
            Category = updateDto.Category,
            Description = updateDto.Description,
            Rating = updateDto.Rating,
            OpeningHours = updateDto.OpeningHours,
            EntryFee = updateDto.EntryFee
        };

        return await _proxyService.ForwardJsonRequest(Request, $"/attractions/{id}", HttpMethod.Put, attraction);
    }


    [HttpDelete("attractions/{id}")]
    [AllowAnonymous]
    public Task<IActionResult> DeleteAttraction(Guid id) => _proxyService.ForwardRequest(Request, $"/attractions/{id}", HttpMethod.Delete);

    [HttpGet("users")]
    [AllowAnonymous]
    public Task<IActionResult> GetUsers() => _proxyService.ForwardRequest(Request, "/users", HttpMethod.Get);

    [HttpGet("user/{id}")]
    [AllowAnonymous]
    public Task<IActionResult> GetUserById(Guid id) => _proxyService.ForwardRequest(Request, $"/user/{id}", HttpMethod.Get);

    /*[HttpPost("user")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createDto)
    {
        var user = new UserDTO
        {
            Id = Guid.NewGuid(),
            Username = createDto.Username,
            Email = createDto.Email,
            PasswordHash = SecretHasher.Hash( createDto.PasswordUnhashed ),
            Role = createDto.Role
        };

        return await _proxyService.ForwardJsonRequest(Request, "/user", HttpMethod.Post, user);
    }*/
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] CreateUserDto registerDto)
    {
        return await _proxyService.ForwardJsonRequest(Request, "/register", HttpMethod.Post, registerDto);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        return await _proxyService.ForwardJsonRequest(Request, "/login", HttpMethod.Post, loginDto);
    }



    [HttpPut("user/{id}")]
    [AllowAnonymous]
    public Task<IActionResult> UpdateUser(Guid id) => _proxyService.ForwardRequest(Request, $"/user/{id}", HttpMethod.Put);

    [HttpDelete("user/{id}")]
    [AllowAnonymous]
    public Task<IActionResult> DeleteUser(Guid id) => _proxyService.ForwardRequest(Request, $"/user/{id}", HttpMethod.Delete);
}
