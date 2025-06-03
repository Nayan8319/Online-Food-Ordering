namespace FoodieApi.Models.DTO
{
    public class MenuDto
    {
        public int MenuId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int CategoryId { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateMenuDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }  // <- nullable now
        public int CategoryId { get; set; }
        public bool IsActive { get; set; }
    }

}
