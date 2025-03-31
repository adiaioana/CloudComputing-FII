using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/image")]
public class ImageController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ImageController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetImage([FromQuery] string location)
    {
        if (string.IsNullOrWhiteSpace(location))
        {
            return BadRequest(new { error = "Location is required" });
        }

        var fastApiUrl = $"http://localhost:8000-->/image?location={Uri.EscapeDataString(location)}";

        try
        {
            var response = await _httpClient.GetAsync(fastApiUrl);
            response.EnsureSuccessStatusCode(); // Throws if status code is not 2xx

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { error = "Error calling FastAPI", details = ex.Message });
        }
    }
}
