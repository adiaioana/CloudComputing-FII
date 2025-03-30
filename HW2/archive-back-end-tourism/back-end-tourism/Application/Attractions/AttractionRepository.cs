using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;
using back_end_tourism.Domain;
using back_end_tourism.Infrastructure;
using System.Diagnostics.Eventing.Reader;

namespace back_end_tourism.Application
{
    public class AttractionRepository : IAttractionRepository
    {
        private readonly ApplicationDbContext _context;

        public AttractionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Attraction>> GetAllAttractionsAsync()
        {
            return await _context.Attractions.ToListAsync();
        }

        public async Task<Attraction> GetAttractionByIdAsync(Guid id)
        {
            return await _context.Attractions.FindAsync(id);
        }

        public async Task<Attraction> CreateAttractionAsync(AttractionDTO_forPOST almost_attraction)
        {
            var attraction = almost_attraction.convertToAttraction();
            _context.Attractions.Add(attraction);
            await _context.SaveChangesAsync();
            return attraction;
        }

        public async Task<bool> UpdateAttractionAsync(Guid id, AttractionDTO_forPOST updatedAttraction)
        {
            var existingAttraction = await _context.Attractions.FindAsync(id);
            if (existingAttraction == null)
            {
                return false;
            }

            // Update fields as necessary
            if (updatedAttraction.Name != null) existingAttraction.Name = updatedAttraction.Name;
            if (updatedAttraction.Description != null)  existingAttraction.Description = updatedAttraction.Description;
            if(updatedAttraction.Location!=null) existingAttraction.Location = updatedAttraction.Location;
            if(updatedAttraction.Rating!=null) existingAttraction.Rating = (decimal)updatedAttraction.Rating;
            if(updatedAttraction.Category!=null) existingAttraction.Category = updatedAttraction.Category;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAttractionAsync(Guid id)
        {
            var attraction = await _context.Attractions.FindAsync(id);
            if (attraction == null)
            {
                return false;
            }

            _context.Attractions.Remove(attraction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<string>> GetAllLocationsAsync()
        {
            return await _context.Attractions.Select(a => a.Location).Distinct().ToListAsync();
        }

        public async Task<IEnumerable<Attraction>> GetMuseumsAsync()
        {
            return await _context.Attractions.Where(a => a.Category == "museum").ToListAsync();
        }
    }
}
