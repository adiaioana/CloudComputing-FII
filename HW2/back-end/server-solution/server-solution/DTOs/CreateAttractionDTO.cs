namespace server_solution.DTOs
{
    public class CreateAttractionDto
    {
        public required string Name { get; set; }
        public required string Location { get; set; }
        public required string Category { get; set; }
        public string? Description { get; set; }
        public float? Rating { get; set; }
        public string? OpeningHours { get; set; }
        public string? EntryFee { get; set; }
    }

}
