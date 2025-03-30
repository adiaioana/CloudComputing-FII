using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using back_end_tourism.Domain;
using Domain.Entities;

namespace back_end_tourism.Application
{
    public interface IAttractionRepository
    {
        public Task<IEnumerable<Attraction>> GetAllAttractionsAsync();
        public Task<Attraction> GetAttractionByIdAsync(Guid id);
        public Task<IEnumerable<Attraction>> GetMuseumsAsync();

        public Task<IEnumerable<string>> GetAllLocationsAsync();
        public Task<bool> DeleteAttractionAsync(Guid id);
        public Task<bool> UpdateAttractionAsync(Guid id, AttractionDTO_forPOST attraction);
        public Task<Attraction> CreateAttractionAsync(AttractionDTO_forPOST attraction);

    }
}
