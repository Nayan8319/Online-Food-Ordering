namespace FoodieApi.Models.Auth
{
    public class VerifyOtpRequest
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ImageUrl { get; set; }
        public string Otp { get; set; }
    }
}
