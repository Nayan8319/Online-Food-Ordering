using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace FoodieApi.Controllers.UserControllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User,Admin")]
    public class CartOrderController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public CartOrderController(FoodieOrderningContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private async Task<CartSummaryDto> GetUserCartSummary(int userId)
        {
            var cartItems = await _context.Carts
                .Include(c => c.Menu)
                .Where(c => c.UserId == userId)
                .Select(c => new CartResponseDto
                {
                    CartId = c.CartId,
                    MenuId = c.MenuId,
                    MenuName = c.Menu.Name,
                    PricePerItem = c.Menu.Price,
                    Quantity = c.Quantity,
                    TotalPrice = c.TotalPrice,
                    ImageUrl = c.Menu.ImageUrl
                }).ToListAsync();

            return new CartSummaryDto
            {
                Items = cartItems,
                TotalAmount = cartItems.Sum(item => item.TotalPrice)
            };
        }

        // 1. GET User's Cart
        [HttpGet]
        public async Task<ActionResult<CartSummaryDto>> GetUserCart()
        {
            int userId = GetUserId();
            var result = await GetUserCartSummary(userId);
            return Ok(result);
        }

        // 2. POST Add Item to Cart
        [HttpPost]
        public async Task<ActionResult> AddToCart(CartRequestDto request)
        {
            int userId = GetUserId();

            var menu = await _context.Menus.FindAsync(request.MenuId);
            if (menu == null)
                return NotFound("Menu item not found.");

            if (request.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var existingCartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.MenuId == request.MenuId);

            int stockAvailable = menu.Quantity;

            if (existingCartItem != null)
            {
                // Only check for new quantity being added
                if (request.Quantity > stockAvailable)
                    return BadRequest($"Only {stockAvailable} items available in stock.");

                existingCartItem.Quantity += request.Quantity;
                existingCartItem.TotalPrice = existingCartItem.Quantity * menu.Price;
            }
            else
            {
                if (request.Quantity > stockAvailable)
                    return BadRequest($"Only {stockAvailable} items available in stock.");

                var newCart = new Cart
                {
                    MenuId = request.MenuId,
                    Quantity = request.Quantity,
                    UserId = userId,
                    TotalPrice = request.Quantity * menu.Price
                };
                _context.Carts.Add(newCart);
            }

            menu.Quantity -= request.Quantity;

            await _context.SaveChangesAsync();

            var updatedCart = await GetUserCartSummary(userId);
            return Ok(updatedCart);
        }

        // 3. PUT Update Quantity
        [HttpPut("{cartId}")]
        public async Task<ActionResult> UpdateQuantity(int cartId, CartRequestDto request)
        {
            int userId = GetUserId();

            if (request.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var cartItem = await _context.Carts
                .Include(c => c.Menu)
                .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            var menu = cartItem.Menu;

            int oldQuantity = cartItem.Quantity;
            int newQuantity = request.Quantity;
            int quantityDifference = newQuantity - oldQuantity;

            if (quantityDifference == 0)
                return BadRequest("Quantity is the same as before.");

            if (quantityDifference > 0)
            {
                if (quantityDifference > menu.Quantity)
                    return BadRequest($"Only {menu.Quantity} items available in stock.");

                menu.Quantity -= quantityDifference;
            }
            else
            {
                menu.Quantity += -quantityDifference; // Restore stock if decreasing
            }

            cartItem.Quantity = newQuantity;
            cartItem.TotalPrice = newQuantity * menu.Price;

            await _context.SaveChangesAsync();

            var updatedCart = await GetUserCartSummary(userId);
            return Ok(updatedCart);
        }

        // 4. DELETE Remove Item from Cart
        [HttpDelete("{cartId}")]
        public async Task<ActionResult> DeleteItem(int cartId)
        {
            int userId = GetUserId();

            var cartItem = await _context.Carts
                .Include(c => c.Menu)
                .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            cartItem.Menu.Quantity += cartItem.Quantity; // Restore stock

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();

            var updatedCart = await GetUserCartSummary(userId);
            return Ok(updatedCart);
        }
    }
}
