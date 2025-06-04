// Models/Dto/UpdateProfileRequest.cs
namespace FoodieApi.Models.Dto
{
    public class UpdateProfileRequest
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string Mobile { get; set; }
        public string? ImageUrl { get; set; }  // Optional, in case imageFile is not sent
    }

}
