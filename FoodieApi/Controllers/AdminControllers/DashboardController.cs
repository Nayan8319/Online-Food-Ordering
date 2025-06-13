using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public DashboardController(FoodieOrderningContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalMenus = await _context.Menus.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);

            var stats = new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalOrders = totalOrders,
                TotalMenus = totalMenus,
                TotalCategories = totalCategories,
                TotalSales = totalSales
            };

            return Ok(stats);
        }

        // GET: api/dashboard/latest-orders
        [HttpGet("latest-orders")]
        public async Task<IActionResult> GetLatestOrders()
        {
            var latestOrders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new LatestOrderDto
                {
                    OrderNo = o.OrderNo,
                    Username = o.User.Username,
                    Status = o.Status,
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.OrderDate
                })
                .ToListAsync();

            return Ok(latestOrders);
        }

        // GET: api/dashboard/sales-chart?range=daily|weekly|monthly
        [HttpGet("sales-chart")]
        public async Task<IActionResult> GetSalesChart([FromQuery] string range = "monthly")
        {
            var orders = await _context.Orders
                .Where(o => o.OrderDate != null)
                .ToListAsync();

            List<object> chartData = new();

            range = range.ToLower();

            if (range == "daily")
            {
                chartData = orders
                    .GroupBy(o => o.OrderDate.Date)
                    .Select(g => new
                    {
                        Name = g.Key.ToString("ddd"), // e.g., Mon, Tue
                        Sales = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(d => d.Name)
                    .Cast<object>()
                    .ToList();
            }
            else if (range == "weekly")
            {
                chartData = orders
                    .GroupBy(o => CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
                        o.OrderDate, CalendarWeekRule.FirstDay, DayOfWeek.Monday))
                    .Select(g => new
                    {
                        Name = $"Week {g.Key}",
                        Sales = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(d => d.Name)
                    .Cast<object>()
                    .ToList();
            }
            else if (range == "monthly")
            {
                chartData = orders
                    .GroupBy(o => o.OrderDate.Month)
                    .Select(g => new
                    {
                        MonthNumber = g.Key,
                        Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                        Sales = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(d => d.MonthNumber)
                    .Select(d => new { d.Name, d.Sales })
                    .Cast<object>()
                    .ToList();
            }

            return Ok(chartData);
        }

        [HttpGet("today-orders")]
        public async Task<IActionResult> GetTodayOrdersForCsv()
        {
            var today = DateTime.Today;

            var orders = await _context.Orders
                .Where(o => o.OrderDate.Date == today)
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Menu)
                .ToListAsync();

            var exportData = orders.SelectMany(order => order.OrderDetails.Select(detail => new
            {
                OrderId = order.OrderId,
                OrderNo = order.OrderNo,
                Username = order.User.Username,
                OrderDate = order.OrderDate.ToString("yyyy-MM-dd HH:mm"),
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(detail => new
                {
                    MenuId = detail.MenuId,
                    MenuName = detail.Menu.Name,
                    Quantity = detail.Quantity,
                    Price = detail.Price,
                    ImageUrl = detail.Menu.ImageUrl
                }).ToList()

            })).ToList();

            return Ok(exportData);
        }

        [HttpGet("orders-by-date")]
        public async Task<IActionResult> GetOrdersByDate([FromQuery] string date)
        {
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                return BadRequest(new { message = "Invalid date format. Please use a recognizable date format like yyyy-MM-dd or yyyy/MM/dd." });
            }

            var orders = await _context.Orders
                .Where(o => o.OrderDate.Date == parsedDate.Date)
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Menu)
                .ToListAsync();

            var response = orders.Select(order => new
            {
                order.OrderId,
                UserId = order.UserId,
                UserName = order.User.Username, // or FullName if preferred
                order.OrderNo,
                order.PaymentId,
                order.Status,
                order.OrderDate,
                order.TotalAmount,
                OrderDetails = order.OrderDetails.Select(detail => new
                {
                    MenuId = detail.MenuId,
                    MenuName = detail.Menu.Name,
                    Quantity = detail.Quantity,
                    Price = detail.Price,
                    ImageUrl = detail.Menu.ImageUrl
                }).ToList()
            });

            return Ok(response);
        }


    }
}
