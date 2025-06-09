using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using System;
using FoodieApi.Models.DTO;
using FoodieApi.Models;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class OrdersController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public OrdersController(FoodieOrderningContext context)
        {
            _context = context;
        }

        // ✅ POST: Place a new order
        [HttpPost("placeOrder")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.AddressId == request.AddressId && a.UserId == userId);
            if (address == null)
                return NotFound("Address not found or does not belong to user");

            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == request.PaymentId && p.AddressId == request.AddressId);
            if (payment == null)
                return NotFound("Payment not found or does not match address");

            var cartItems = await _context.Carts.Include(c => c.Menu).Where(c => c.UserId == userId).ToListAsync();
            if (cartItems.Count == 0)
                return BadRequest("Cart is empty");

            decimal totalAmount = payment.TotalAmount;

            var order = new Order
            {
                OrderNo = "ORD" + DateTime.UtcNow.Ticks,
                UserId = userId,
                PaymentId = payment.PaymentId,
                Status = "Placed",
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var cartItem in cartItems)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.OrderId,
                    MenuId = cartItem.MenuId,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.TotalPrice
                };
                _context.OrderDetails.Add(orderDetail);
            }

            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            var response = new PlaceOrderResponseDto
            {
                Message = "Order placed successfully",
                OrderId = order.OrderId,
                OrderNo = order.OrderNo,
                TotalAmount = totalAmount
            };

            return Ok(response);
        }

        // ✅ GET: Get order by ID
        [HttpGet("getOrderById/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var order = await _context.Orders
                .Include(o => o.OrderDetails).ThenInclude(od => od.Menu)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId);

            if (order == null)
                return NotFound("Order not found");

            var orderDto = new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
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
            };

            return Ok(orderDto);
        }

        // ✅ GET: Get all orders for the logged-in user
        [HttpGet("getAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var orders = await _context.Orders
                .Include(o => o.OrderDetails).ThenInclude(od => od.Menu)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            var orderDtos = orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
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

        // ✅ GET: Get all order details for logged-in user
        [HttpGet("getAllOrderDetails")]
        public async Task<IActionResult> GetAllOrderDetails()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var orderDetails = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Menu)
                .Where(od => od.Order.UserId == userId)
                .ToListAsync();

            var detailDtos = orderDetails.Select(od => new OrderDetailsDto
            {
                MenuId = od.MenuId,
                MenuName = od.Menu.Name,
                Quantity = od.Quantity,
                Price = od.Price
            }).ToList();

            return Ok(detailDtos);
        }

        // ✅ GET: Get order details by order ID for logged-in user
        [HttpGet("getOrderDetailsById/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsById(int orderId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var order = await _context.Orders
                .Include(o => o.OrderDetails).ThenInclude(od => od.Menu)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

            if (order == null)
                return NotFound("Order not found or access denied");

            var detailsDto = order.OrderDetails.Select(od => new OrderDetailsDto
            {
                MenuId = od.MenuId,
                MenuName = od.Menu.Name,
                Quantity = od.Quantity,
                Price = od.Price
            }).ToList();

            return Ok(detailsDto);
        }

        // ✅ PUT: Cancel an order by ID (only by the user who placed it)
        [HttpPut("cancelOrder/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID.");

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);
            if (order == null)
                return NotFound("Order not found or does not belong to user");

            if (order.Status == "Cancelled")
                return BadRequest("Order is already cancelled");

            // Update order status
            order.Status = "Cancelled";
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Order cancelled successfully",
                OrderId = order.OrderId,
                Status = order.Status
            });
        }

    }
}
