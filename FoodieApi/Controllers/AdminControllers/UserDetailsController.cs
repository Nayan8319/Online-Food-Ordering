﻿using FoodieApi.Helpers;
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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public AdminController(FoodieOrderningContext context)
        {
            _context = context;
        }

        // ✅ GET: All users with roles
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

        // ✅ PUT: Verify or unverify user
        [HttpPut("verify/{userId}")]
        public async Task<IActionResult> SetUserVerificationStatus(int userId, [FromQuery] bool isVerified)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            user.IsVerified = isVerified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"User verification status updated to {isVerified}",
                UserId = user.UserId,
                IsVerified = user.IsVerified
            });
        }

        // ✅ GET: All orders (admin access)
        [HttpGet("getAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Menu)
                .Include(o => o.Payment)
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
                    Price = od.Price,
                    ImageUrl = od.Menu.ImageUrl
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        // ✅ GET: Orders by specific user (admin action)
        [HttpGet("getOrdersByUser/{userId}")]
        public async Task<IActionResult> GetOrdersByUser(int userId)
        {
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
                    Price = od.Price,
                    ImageUrl = od.Menu.ImageUrl
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        [HttpPut("update-status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto statusDto)
        {
            string newStatus = statusDto.NewStatus.ToString(); // convert enum to string

            if (!OrderStatuses.All.Contains(newStatus))
            {
                return BadRequest(new
                {
                    Message = $"Invalid status. Allowed values: {string.Join(", ", OrderStatuses.All)}"
                });
            }

            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return NotFound(new { Message = "Order not found." });

            order.Status = newStatus;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Order status updated successfully",
                OrderId = order.OrderId,
                NewStatus = order.Status
            });
        }
    }
}
