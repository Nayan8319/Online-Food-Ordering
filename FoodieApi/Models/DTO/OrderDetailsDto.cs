namespace FoodieApi.Models.DTO
{
    public class OrderDetailsDto
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
    public class CreateOrderDetailsDto
    {
        public int MenuId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
