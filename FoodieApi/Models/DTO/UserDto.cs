namespace FoodieApi.Models.Dto
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Mobile { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string RoleName { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public bool IsVerified { get; set; }
    }
}
