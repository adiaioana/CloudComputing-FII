using Domain.Entities;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace back_end_tourism.Domain
{

    public class AttractionDTO_forPOST
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string? Description { get; set; }
        public string Category { get; set; }
        public string? OpeningHours { get; set; }
        public string? EntryFee { get; set; }
        public decimal? Rating { get; set; }
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
            if (this.Description == null)
            {
                this.Description = "";
            }
            if (this.OpeningHours == null)
            {
                this.OpeningHours = "";
            }
            if (this.EntryFee == null)
            {
                this.EntryFee = "";
            }
            if (this.Rating == null)
            {
                this.Rating = null;
            }
            Attraction attraction = VeryBadConstructor(Guid.NewGuid(),this.Name,this.Location,this.Description, this.Category, this.OpeningHours, this.EntryFee, Convert.ToDecimal( this.Rating));

            return attraction;
        }

        public Attraction convertToAttractionWithNull()
        {
            Attraction attraction = VeryBadConstructor(Guid.Empty, this.Name, this.Location, this.Description, this.Category, this.OpeningHours, this.EntryFee, Convert.ToDecimal(this.Rating));
            return attraction;
        }
    }
}
