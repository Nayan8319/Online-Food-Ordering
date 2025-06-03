using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodieApi.Models;
using FoodieApi.Models.DTO;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMenuCategoryController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public UserMenuCategoryController(FoodieOrderningContext context)
        {
            _context = context;
        }

        // ✅ GET: api/UserMenuCategory/allActiveMenus
        [HttpGet("allActiveMenus")]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetAllActiveMenus()
        {
            var activeMenus = await _context.Menus
                .Where(m => m.IsActive && m.Category.IsActive)
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                })
                .ToListAsync();

            if (activeMenus == null || activeMenus.Count == 0)
                return NotFound("No active menu items found.");

            return Ok(activeMenus);
        }

        // ✅ GET: api/UserMenuCategory/activeCategories
        [HttpGet("activeCategories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetActiveCategories()
        {
            var categories = await _context.Categories
                .Where(c => c.IsActive)
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    IsActive = c.IsActive
                })
                .ToListAsync();

            return Ok(categories);
        }

        // ✅ GET: api/UserMenuCategory/category/{categoryId}/menus
        [HttpGet("category/{categoryId}/menus")]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenusByCategory(int categoryId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null || !category.IsActive)
                return NotFound("Category not found or inactive.");

            var menus = await _context.Menus
                .Where(m => m.CategoryId == categoryId && m.IsActive)
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                })
                .ToListAsync();

            if (menus == null || menus.Count == 0)
                return NotFound("No active menu items found for the selected category.");

            return Ok(menus);
        }

        // ✅ GET: api/UserMenuCategory/searchMenus?keyword=pizza
        [HttpGet("searchMenus")]
        public async Task<ActionResult<IEnumerable<MenuDto>>> SearchMenus(string? keyword)
        {
            var query = _context.Menus
                .Where(m => m.IsActive && m.Category.IsActive);

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(m => m.Name.Contains(keyword));
            }

            var result = await query
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                })
                .ToListAsync();

            return Ok(result);
        }

        // ✅ GET: api/UserMenuCategory/menu/{menuId}
        [HttpGet("menu/{menuId}")]
        public async Task<ActionResult<MenuDto>> GetMenuById(int menuId)
        {
            var menu = await _context.Menus
                .Include(m => m.Category)
                .Where(m => m.MenuId == menuId && m.IsActive && m.Category.IsActive)
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                })
                .FirstOrDefaultAsync();

            if (menu == null)
                return NotFound("Menu item not found or inactive.");

            return Ok(menu);
        }
    }
}
