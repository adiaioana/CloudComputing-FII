using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Text.Json;
using System.Text;
using System.Net.Http.Headers;

namespace server_solution.Services
{
    public class DataService
    {

        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly string _apiUrl = "";

        public DataService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _apiUrl = _configuration["DataAPI:BaseUrl"];
        }

        private HttpRequestMessage CreateForwardRequest(HttpRequest originalRequest, string endpoint, HttpMethod method)
        {
            var forwardRequest = new HttpRequestMessage(method, $"{_apiUrl}{endpoint}");

            // Copy headers (including JWT)
            foreach (var header in originalRequest.Headers)
            {
                if (!forwardRequest.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
                {
                    forwardRequest.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                }
            }

            // Forward request body
            if (method == HttpMethod.Post || method == HttpMethod.Put)
            {
                forwardRequest.Content = new StreamContent(originalRequest.Body);
                forwardRequest.Content.Headers.ContentType = new MediaTypeHeaderValue(originalRequest.ContentType);
            }

            return forwardRequest;
        }

        public async Task<IActionResult> ForwardRequest(HttpRequest request, string endpoint, HttpMethod method)
        {
            var forwardRequest = CreateForwardRequest(request, endpoint, method);
            var response = await _httpClient.SendAsync(forwardRequest);

            var content = await response.Content.ReadAsStringAsync();
            return new ContentResult
            {
                StatusCode = (int)response.StatusCode,
                Content = content,
                ContentType = response.Content.Headers.ContentType?.ToString()
            };
        }
        public async Task<IActionResult> ForwardJsonRequest(HttpRequest request, string path, HttpMethod method, object body)
        {
            try
            {
                var jsonSerializerOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase // Convert PascalCase → camelCase
                };

                // Convert camelCase to snake_case manually
                var snakeCaseJson = JsonConvert.SerializeObject(body, new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new SnakeCaseNamingStrategy() // Convert camelCase → snake_case
                    }
                });

                var jsonContent = new StringContent(snakeCaseJson, Encoding.UTF8, "application/json");
                Console.WriteLine(jsonContent.ToString());

                var forwardRequest = new HttpRequestMessage(method, $"{_apiUrl}{path}")
                {
                    Content = jsonContent
                };

                // **Copy headers from the original request**
                foreach (var header in request.Headers)
                {
                    // **Skip headers that might cause issues**
                    if (!header.Key.Equals("Host", StringComparison.OrdinalIgnoreCase) &&
                        !header.Key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
                    {
                        forwardRequest.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                    }
                }



                var response = await _httpClient.SendAsync(forwardRequest);
                var responseContent = await response.Content.ReadAsStringAsync();

                return new ObjectResult(responseContent) { StatusCode = (int)response.StatusCode };
            }
            catch (Exception ex)
            {
                return new ObjectResult(new { error = "Failed to forward request", details = ex.Message })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }

    }
}
