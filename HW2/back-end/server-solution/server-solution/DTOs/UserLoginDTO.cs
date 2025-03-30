namespace server_solution.DTOs
{
    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string PasswordUnhashed { get; set; } // Plain text password
    }

}
