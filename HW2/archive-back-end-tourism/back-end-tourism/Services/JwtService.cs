using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Domain.Entities;

namespace back_end_tourism.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user)
        {
            // Get the secret key from the configuration file
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);

            // Define claims that will be included in the token
            var claims = new[]
            {
                // This matches the Python code's expectation for 'user_id'
                new Claim("user_id", user.Id.ToString()),  // Using 'user_id' to match the Python API
                new Claim(JwtRegisteredClaimNames.Email, user.Email),  // Email claim
                new Claim(ClaimTypes.Role, user.Role),  // Role claim (important for checking admin access)
                new Claim("Username", user.Username)  // Username claim
            };

            // Create signing credentials with HS256 algorithm
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            // Create the token with the necessary claims, issuer, audience, and expiration time
            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],  // Issuer
                audience: _config["JwtSettings:Audience"],  // Audience
                claims: claims,  // Claims added to the token
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["JwtSettings:ExpiryMinutes"])),  // Expiry time
                signingCredentials: credentials  // Signing credentials
            );

            // Return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
