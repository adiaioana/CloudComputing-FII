namespace server_solution.DTOs
{
    public class CreateUserDto
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordUnhashed { get; set; }  //unhashedddd
        public required string Role { get; set; }
    }
}
