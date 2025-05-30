namespace FoodieApi.Models.DTO
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public bool IsActive { get; set; }
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; } // Optional for online images
    }

}
