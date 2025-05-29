using FoodieApi.Helper;
using FoodieApi.Helpers;
using FoodieApi.Models;
using FoodieApi.Models.Auth;
using FoodieApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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

        // Temporary in-memory storage for OTPs with timestamps
        private static Dictionary<string, (string Otp, DateTime GeneratedAt)> otpStore = new();

        public AuthController(FoodieOrderningContext context, EmailService emailService, JwtHelper jwtHelper)
        {
            _context = context;
            _emailService = emailService;
            _jwtHelper = jwtHelper;
        }

        // POST: api/Auth/Register
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

        // POST: api/Auth/VerifyOtp
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
                RoleId = 2, // Default user role
                CreatedDate = DateTime.Now,
                IsVerified = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        // POST: api/Auth/Login
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

        // Helper: Generate a 6-digit OTP
        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // POST: api/Auth/resend-otp
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] string email)
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return BadRequest("User already registered.");

            var otp = GenerateOtp();
            otpStore[email] = (otp, DateTime.UtcNow);
            await _emailService.SendOtpEmailAsync(email, otp);

            return Ok("OTP resent to your email.");
        }

        // POST: api/Auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return BadRequest("User not found.");

            var otp = GenerateOtp();
            otpStore[email] = (otp, DateTime.UtcNow);
            await _emailService.SendOtpEmailAsync(email, otp);

            return Ok("OTP sent to reset password.");
        }

        // POST: api/Auth/verify-forgot-otp
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

        // POST: api/Auth/reset-password
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
    }
}
