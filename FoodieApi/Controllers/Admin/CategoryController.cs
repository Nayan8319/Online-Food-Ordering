using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Ensure only Admin can access these routes
    public class CategoryController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public CategoryController(FoodieOrderningContext context)
        {
            _context = context;
        }

        // Get all categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            return await _context.Categories
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    IsActive = c.IsActive
                }).ToListAsync();
        }

        // Create a new category
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                ImageUrl = dto.ImageUrl,
                IsActive = dto.IsActive,
                CreatedDate = DateTime.Now
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok("Category created successfully.");
        }

        // Update an existing category
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.ImageUrl = dto.ImageUrl;
            category.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok("Category updated.");
        }

        // Delete a category
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok("Category deleted.");
        }
    }
}
