using System.ComponentModel.DataAnnotations;

namespace FoodieApi.Models.DTO
{
    // ✅ Define the enum
    public enum OrderStatusEnum
    {
        Placed,
        Confirmed,
        OutForDelivery,
        Delivered
    }

    // ✅ Use enum in DTO
    public class UpdateOrderStatusDto
    {
        [Required]
 
        public OrderStatusEnum NewStatus { get; set; }
    }
}
