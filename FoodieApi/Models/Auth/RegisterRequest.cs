
namespace FoodieApi.Models.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Mobile { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
    }
}
