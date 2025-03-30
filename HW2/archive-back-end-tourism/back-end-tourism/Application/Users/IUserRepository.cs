

using System.Threading.Tasks;
using Domain.Entities;
namespace back_end_tourism.Application.Users
{
    public interface IUserRepository
    {
        Task<User> RegisterAsync(User user);
        Task<User> AuthenticateAsync(string email, string password);
        public Task<bool> EmailExistsAsync(string email);
        public Task<User?> GetUserByIdAsync(Guid userId);
    }

}
