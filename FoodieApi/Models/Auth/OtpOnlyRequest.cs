namespace FoodieApi.Models.Auth
{
    public class OtpOnlyRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }
}
