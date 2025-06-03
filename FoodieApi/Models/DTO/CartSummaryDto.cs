namespace FoodieApi.Models.DTO
{
    public class CartSummaryDto
    {
        public List<CartResponseDto> Items { get; set; } = new List<CartResponseDto>();
        public decimal TotalAmount { get; set; }
    }
}