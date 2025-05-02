using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MenuController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public MenuController(FoodieOrderningContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            return await _context.Menus
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
                }).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto dto)
        {
            var menu = new Menu
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,
                IsActive = dto.IsActive,
                CreatedDate = DateTime.Now
            };

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();
            return Ok("Menu item created.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] CreateMenuDto dto)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null) return NotFound();

            menu.Name = dto.Name;
            menu.Description = dto.Description;
            menu.Price = dto.Price;
            menu.Quantity = dto.Quantity;
            menu.ImageUrl = dto.ImageUrl;
            menu.CategoryId = dto.CategoryId;
            menu.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok("Menu item updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null) return NotFound();

            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();
            return Ok("Menu item deleted.");
        }
    }
}
