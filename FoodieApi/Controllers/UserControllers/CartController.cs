using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User")]
public class CartController : ControllerBase
{
    private readonly FoodieOrderningContext _context;

    public CartController(FoodieOrderningContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // 1. GET User's Cart
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartResponseDto>>> GetUserCart()
    {
        int userId = GetUserId();

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
                TotalPrice = c.TotalPrice
            }).ToListAsync();

        return Ok(cartItems);
    }

    // 2. POST Add Item to Cart
    [HttpPost]
    public async Task<ActionResult> AddToCart(CartRequestDto request)
    {
        int userId = GetUserId();

        var menu = await _context.Menus.FindAsync(request.MenuId);
        if (menu == null) return NotFound("Menu item not found");

        var existingCartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.MenuId == request.MenuId);

        if (existingCartItem != null)
        {
            existingCartItem.Quantity += request.Quantity;
            existingCartItem.TotalPrice = existingCartItem.Quantity * menu.Price;
        }
        else
        {
            var newCart = new Cart
            {
                MenuId = request.MenuId,
                Quantity = request.Quantity,
                UserId = userId,
                TotalPrice = request.Quantity * menu.Price
            };
            _context.Carts.Add(newCart);
        }

        await _context.SaveChangesAsync();
        return Ok("Item added/updated in cart.");
    }

    // 3. PUT Update Quantity
    [HttpPut("{cartId}")]
    public async Task<ActionResult> UpdateQuantity(int cartId, CartRequestDto request)
    {
        int userId = GetUserId();

        var cartItem = await _context.Carts
            .Include(c => c.Menu)
            .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

        if (cartItem == null)
            return NotFound("Cart item not found.");

        cartItem.Quantity = request.Quantity;
        cartItem.TotalPrice = request.Quantity * cartItem.Menu.Price;

        await _context.SaveChangesAsync();
        return Ok("Cart item updated.");
    }

    // 4. DELETE Remove Item from Cart
    [HttpDelete("{cartId}")]
    public async Task<ActionResult> DeleteItem(int cartId)
    {
        int userId = GetUserId();

        var cartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);

        if (cartItem == null)
            return NotFound("Cart item not found.");

        _context.Carts.Remove(cartItem);
        await _context.SaveChangesAsync();
        return Ok("Cart item deleted.");
    }
}
