using FoodieApi.Models;
using FoodieApi.Models.Dto;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public AdminController(FoodieOrderningContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("allUsers")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Username = u.Username,
                    Email = u.Email,
                    Mobile = u.Mobile,
                    ImageUrl = u.ImageUrl,
                    RoleName = u.Role.RoleName,
                    CreatedDate = u.CreatedDate,
                    IsVerified = u.IsVerified
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("verify/{userId}")]
        public async Task<IActionResult> SetUserVerificationStatus(int userId, [FromQuery] bool isVerified)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            user.IsVerified = isVerified;
            await _context.SaveChangesAsync();

            return Ok($"User verification status set to {isVerified}.");
        }


        [HttpGet("getOrderByUser")]
        public async Task<IActionResult> GetOrdersByUser()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Menu)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            var orderDtos = orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                OrderNo = order.OrderNo,
                PaymentId = order.PaymentId,
                Status = order.Status,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailsDto
                {
                    MenuId = od.MenuId,
                    MenuName = od.Menu.Name,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        [HttpGet("getAllOrders")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Menu)
                .Include(o => o.User)
                .ToListAsync();

            var orderDtos = orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                OrderNo = order.OrderNo,
                PaymentId = order.PaymentId,
                Status = order.Status,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailsDto
                {
                    MenuId = od.MenuId,
                    MenuName = od.Menu.Name,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        [HttpPut("update-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Order not found");

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order status updated", Status = newStatus });
        }
    }
}

