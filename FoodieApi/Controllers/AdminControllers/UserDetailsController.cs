using FoodieApi.Models;
using FoodieApi.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}
