using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using back_end_tourism.Application;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using back_end_tourism.Domain;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace back_end_tourism.Controllers
{
    [Route("api/attractions")]
    [ApiController]
    [Authorize]
    public class AttractionController : ControllerBase
    {
        private readonly IAttractionRepository _attractionRepository;

        public AttractionController(IAttractionRepository attractionRepository)
        {
            _attractionRepository = attractionRepository;
        }

        // ✅ Get all attractions
        [HttpGet]
        public async Task<IActionResult> GetAllAttractions()
        {
            var attractions = await _attractionRepository.GetAllAttractionsAsync();
            return Ok(attractions);
        }

        // ✅ Get a single attraction by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttractionById(Guid id)
        {
            var attraction = await _attractionRepository.GetAttractionByIdAsync(id);
            if (attraction == null)
                return NotFound(new { message = "Attraction not found" });

            return Ok(attraction);
        }

        // ✅ Create a new attraction
        [HttpPost]
        public async Task<IActionResult> CreateAttraction([FromBody] AttractionDTO_forPOST almost_attraction)
        {
            // Manual role check
            var userRole = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
           /* Console.WriteLine($"User Role: {userRole}");
            if (userRole != "Admin")
            {
                return Forbid();
            }
            Console.WriteLine("Authorized");*/
            // Create the attraction using the DB context (no API call)
            var newAttraction = almost_attraction.convertToAttraction();
            var result = await _attractionRepository.CreateAttractionAsync(almost_attraction);

            if (result == null)
            {
                return BadRequest(new { message = "Error creating attraction" });
            }

            return CreatedAtAction(nameof(GetAttractionById), new { id = result.Id }, result);
        }

        // ✅ Update an attraction
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Ensure only admins can update attractions
        public async Task<IActionResult> UpdateAttraction(Guid id, [FromBody] AttractionDTO_forPOST almost_attraction)
        {
            // Retrieve the attraction from the DB context
            var existingAttraction = await _attractionRepository.GetAttractionByIdAsync(id);
            if (existingAttraction == null)
            {
                return NotFound(new { message = "Attraction not found" });
            }

            // Update the attraction with the new details
            var result = await _attractionRepository.UpdateAttractionAsync(id, almost_attraction);

            if (!result)
            {
                return BadRequest(new { message = "Error updating attraction" });
            }

            return Ok(new { message = "Attraction updated successfully" });
        }

        // ✅ Delete an attraction
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Ensure only admins can delete attractions
        public async Task<IActionResult> DeleteAttraction(Guid id)
        {
            var attraction = await _attractionRepository.GetAttractionByIdAsync(id);
            if (attraction == null)
            {
                return NotFound(new { message = "Attraction not found" });
            }

            var deleted = await _attractionRepository.DeleteAttractionAsync(id);
            if (!deleted)
            {
                return BadRequest(new { message = "Error deleting attraction" });
            }

            return Ok(new { message = "Attraction deleted successfully" });
        }

        // ✅ Get all locations
        [HttpGet("locations")]
        public async Task<IActionResult> GetAllLocations()
        {
            var locations = await _attractionRepository.GetAllLocationsAsync();
            return Ok(locations);
        }

        // ✅ Get all museums
        [HttpGet("museums")]
        public async Task<IActionResult> GetMuseums()
        {
            var museums = await _attractionRepository.GetMuseumsAsync();
            return Ok(museums);
        }
    }
}
