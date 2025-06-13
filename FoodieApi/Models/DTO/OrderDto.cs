namespace FoodieApi.Models.DTO
{
    public class PlaceOrderRequestDto
    {
        public int AddressId { get; set; }
        public int PaymentId { get; set; }
    }

    public class PlaceOrderResponseDto
    {
        public string Message { get; set; }
        public int OrderId { get; set; }
        public string OrderNo { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class OrderDto
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public string OrderNo { get; set; } = string.Empty;
        public int PaymentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderDetailsDto> OrderDetails { get; set; } = new();
    }

    public class CreateOrderDto
    {
        public int PaymentId { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CreateOrderDetailsDto> OrderDetails { get; set; } = new();
    }

}
