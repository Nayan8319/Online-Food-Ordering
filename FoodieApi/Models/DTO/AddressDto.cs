namespace FoodieApi.Models.DTO
{
    // DTO for returning address info
    public class AddressDto
    {
        public int AddressId { get; set; }
        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public int ZipCode { get; set; }
    }

    // DTO for adding a new address
    public class CreateAddressDto
    {
        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public int ZipCode { get; set; }
    }
}
