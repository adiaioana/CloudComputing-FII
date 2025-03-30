namespace server_solution.DTOs
{
    public class AttractionDto : CreateAttractionDto
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Auto-generated ID
    }

}
