namespace FoodieApi.Models.DTO
{
    public class CartResponseDto
    {
        public int CartId { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; } = null!;
        public decimal PricePerItem { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string ImageUrl { get; set; } = null!; // ✅ New property
    }
}
