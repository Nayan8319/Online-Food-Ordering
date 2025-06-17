using FoodieApi.Helper;
using FoodieApi.Helpers;
using FoodieApi.Models;
using FoodieApi.Models.Auth;
using FoodieApi.Models.Dto;
using FoodieApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Claims; // ✅ Required
using System.Threading.Tasks;
using LoginRequest = FoodieApi.Models.Auth.LoginRequest;
using RegisterRequest = FoodieApi.Models.Auth.RegisterRequest;
using ResetPasswordRequest = FoodieApi.Models.Auth.ResetPasswordRequest;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;
        private readonly EmailService _emailService;
        private readonly JwtHelper _jwtHelper;

        private static Dictionary<string, (string Otp, DateTime GeneratedAt)> otpStore = new();

        public AuthController(FoodieOrderningContext context, EmailService emailService, JwtHelper jwtHelper)
        {
            _context = context;
            _emailService = emailService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email already registered.");

            var otp = GenerateOtp();
            otpStore[request.Email] = (otp, DateTime.UtcNow);
            await _emailService.SendOtpEmailAsync(request.Email, otp);

            return Ok("OTP sent to your email. Please verify to complete registration.");
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest model)
        {
            if (!otpStore.TryGetValue(model.Email, out var otpEntry) ||
                otpEntry.Otp != model.Otp ||
                DateTime.UtcNow > otpEntry.GeneratedAt.AddMinutes(5))
            {
                return BadRequest("Invalid or expired OTP.");
            }

            otpStore.Remove(model.Email);

            var user = new User
            {
                Name = model.Name,
                Username = model.Username,
                Email = model.Email,
                Password = PasswordHelper.HashPassword(model.Password),
                Mobile = model.Mobile,
                ImageUrl = model.ImageUrl ?? "",
                RoleId = 2,
                CreatedDate = DateTime.Now,
                IsVerified = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || !PasswordHelper.VerifyPassword(model.Password, user.Password))
                return Unauthorized("Invalid email or password.");

            if (!user.IsVerified)
                return Unauthorized("Please verify your email first.");

            var token = _jwtHelper.GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                user.UserId,
                user.Name,
                user.Username,
                user.Email,
                user.Role.RoleName
            });
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                // Resend for registration
                var otp = GenerateOtp();
                otpStore[email] = (otp, DateTime.UtcNow);
                await _emailService.SendOtpEmailAsync(email, otp);
                return Ok("OTP resent for registration.");
            }
            else
            {
                // Resend for forgot password
                if (!user.IsVerified)
                    return BadRequest("User is not verified yet.");

                var otp = GenerateOtp();
                otpStore[email] = (otp, DateTime.UtcNow);
                await _emailService.SendOtpEmailAsync(email, otp);
                return Ok("OTP resent to reset password.");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] Models.Auth.ForgotPasswordRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
                return BadRequest("Email is required.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return BadRequest("User not found.");

            var otp = GenerateOtp();
            otpStore[model.Email] = (otp, DateTime.UtcNow);
            await _emailService.SendOtpEmailAsync(model.Email, otp);

            return Ok("OTP sent to reset password.");
        }

        [HttpPost("verify-forgot-otp")]
        public IActionResult VerifyForgotOtp([FromBody] OtpOnlyRequest model)
        {
            if (!otpStore.TryGetValue(model.Email, out var otpEntry) ||
                otpEntry.Otp != model.Otp ||
                DateTime.UtcNow > otpEntry.GeneratedAt.AddMinutes(5))
            {
                return BadRequest("Invalid or expired OTP.");
            }

            otpStore.Remove(model.Email);
            return Ok("OTP verified. You can now reset your password.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return BadRequest("User not found.");

            user.Password = PasswordHelper.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password reset successfully.");
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // ❌ Old
            // var email = User?.FindFirst("email")?.Value;

            // ✅ Updated for fallback safety
            var email = User?.FindFirst("email")?.Value;
            if (string.IsNullOrEmpty(email))
                email = User?.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized("User email not found in token.");

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return NotFound("User not found.");

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Username = user.Username,
                Email = user.Email,
                Mobile = user.Mobile,
                ImageUrl = user.ImageUrl,
                RoleName = user.Role.RoleName,
                CreatedDate = user.CreatedDate,
                IsVerified = user.IsVerified
            };

            return Ok(userDto);
        }

        [Authorize]
        [HttpPut("edit-profile")]
        public async Task<IActionResult> EditProfile([FromForm] UpdateProfileRequest model, IFormFile? imageFile)
        {
            var email = User?.FindFirst("email")?.Value ?? User?.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized("User email not found in token.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound("User not found.");

            // Check for duplicate username (excluding current user)
            var usernameExists = await _context.Users
                .AnyAsync(u => u.Username == model.Username && u.Email != email);
            if (usernameExists)
                return BadRequest("Username already taken.");

            // Define upload folder path
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UserImages");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Handle file upload
            if (imageFile != null && imageFile.Length > 0)
            {
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                user.ImageUrl = "/UserImages/" + uniqueFileName;
            }
            // Handle base64 image string (with or without prefix)
            else if (!string.IsNullOrEmpty(model.ImageUrl) && IsValidBase64(model.ImageUrl))
            {
                try
                {
                    var base64Data = model.ImageUrl;
                    var commaIndex = base64Data.IndexOf(',');
                    if (commaIndex >= 0)
                    {
                        base64Data = base64Data.Substring(commaIndex + 1);
                    }

                    byte[] imageBytes = Convert.FromBase64String(base64Data);
                    var uniqueFileName = Guid.NewGuid().ToString() + ".jpg";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                    user.ImageUrl = "/UserImages/" + uniqueFileName;
                }
                catch (Exception ex)
                {
                    return BadRequest("Invalid base64 image data: " + ex.Message);
                }
            }
            // No image provided (optional: clear image)
            else if (string.IsNullOrEmpty(model.ImageUrl))
            {
                user.ImageUrl = null;
            }

            // Update other profile fields
            user.Name = model.Name;
            user.Username = model.Username;
            user.Mobile = model.Mobile;

            await _context.SaveChangesAsync();

            return Ok("Profile updated successfully.");
        }

        private bool IsValidBase64(string base64String)
        {
            if (string.IsNullOrWhiteSpace(base64String)) return false;
            try
            {
                var base64Data = base64String;
                var commaIndex = base64Data.IndexOf(',');
                if (commaIndex >= 0)
                {
                    base64Data = base64Data.Substring(commaIndex + 1);
                }

                Convert.FromBase64String(base64Data);
                return true;
            }
            catch
            {
                return false;
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
        {
            var email = User?.FindFirst("email")?.Value;
            if (string.IsNullOrEmpty(email))
                email = User?.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized("User email not found in token.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound("User not found.");

            if (!PasswordHelper.VerifyPassword(model.CurrentPassword, user.Password))
                return BadRequest("Current password is incorrect.");

            user.Password = PasswordHelper.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully. Please log in again.");
        }

    }
}