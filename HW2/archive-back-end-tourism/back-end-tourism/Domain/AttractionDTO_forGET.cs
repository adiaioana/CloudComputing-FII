using Domain.Entities;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace back_end_tourism.Domain
{

    public class AttractionDTO_forGET
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string OpeningHours { get; set; }
        public string EntryFee { get; set; }
        public string Rating { get; set; }
        public Attraction VeryBadConstructor(Guid id, string name, string loc, string descr, string category, string opening_hours, string entry_fee, decimal rating)
        {
            var attr = new Attraction();
            attr.Id = id;
            attr.Name = name;
            attr.OpeningHours = opening_hours;
            attr.Location = loc;
            attr.Description = descr;
            attr.Rating = rating;
            attr.Category = category;
            return attr;
        }
        public Attraction convertToAttraction()
        {
            Attraction attraction = VeryBadConstructor(this.Id,this.Name,this.Location,this.Description, this.Category, this.OpeningHours, this.EntryFee, Convert.ToDecimal( this.Rating));

            return attraction;
        }
    }
}
