using Microsoft.AspNetCore.Components.Routing;
using System;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
   
    public class Attraction
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string OpeningHours { get; set; }
        public string EntryFee { get; set; }

        public decimal Rating { get; set; }

        

    }
}
