namespace server_solution.DTOs
{
    public class UserDTO // almost inherits CreateUserDTO bu due to naming ...
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Auto-generated ID

        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }  //unhashedddd
        public required string Role { get; set; }
    }
}
