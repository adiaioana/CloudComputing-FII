using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server_solution.Services;

[Route("api/[controller]")]
[ApiController]
public class UserDataController : ControllerBase
{
    private readonly DataService _proxyService;

    public UserDataController(DataService proxyService)
    {
        _proxyService = proxyService;
    }
    private async Task<IActionResult> ForwardRequest(HttpMethod method, string targetUrl)
    {
        // Forward the request to the ProxyService
        var response = await _proxyService.ForwardRequest(Request, targetUrl, method);
        return response;
    }

    // POST /review - Add a new review
    [HttpPost("review")]
    [AllowAnonymous]
    public Task<IActionResult> CreateReview()
    {
        return ForwardRequest(HttpMethod.Post, "/review");
    }

    // GET /reviews-for-attraction/{attractionId} - Get all reviews for a specific attraction
    [HttpGet("reviews-for-attraction/{attractionId}")]
    [AllowAnonymous]
    public Task<IActionResult> GetReviewsForAttraction(Guid attractionId)
    {
        return ForwardRequest(HttpMethod.Get, $"/reviews-for-attraction/{attractionId}");
    }

    // GET /reviews-made-by-user/{userId} - Get all reviews made by a specific user
    [HttpGet("reviews-made-by-user/{userId}")]
    [AllowAnonymous]
    public Task<IActionResult> GetReviewsMadeByUser(Guid userId)
    {
        return ForwardRequest(HttpMethod.Get, $"/reviews-made-by-user/{userId}");
    }

    // GET /userdata/{userId} - Get user data (photo URL and review history)
    [HttpGet("userdata/{userId}")]
    [AllowAnonymous]
    public Task<IActionResult> GetUserData(Guid userId)
    {
        return ForwardRequest(HttpMethod.Get, $"/userdata/{userId}");
    }

    // POST /userdata - Add or update user data (photo URL, review history)
    [HttpPost("userdata")]
    [AllowAnonymous]
    public Task<IActionResult> CreateUserData()
    {
        return ForwardRequest(HttpMethod.Post, "/userdata");
    }

    // PUT /userdata/{userId} - Update existing user data (photo URL, review history)
    [HttpPut("userdata/{userId}")]
    [AllowAnonymous]
    public Task<IActionResult> UpdateUserData(Guid userId)
    {
        return ForwardRequest(HttpMethod.Put, $"/userdata/{userId}");
    }

}
