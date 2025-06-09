using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace FoodieApi.Controllers.UserControllers
{
    [Route("api/payment")]
    [ApiController]
    [Authorize(Roles = "User,Admin")]
    public class PaymentController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;
        private readonly IConfiguration _configuration;

        public PaymentController(FoodieOrderningContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/payment/addPayment
        [HttpPost("addPayment")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            var userName = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value ?? "User";

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var address = await _context.Addresses.FindAsync(dto.AddressId);
            if (address == null) return NotFound("Address not found.");

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
                return BadRequest("User email not found in token.");

            var payment = new Payment
            {
                Name = dto.Name,
                ExpiryDate = dto.ExpiryDate,
                CvvNo = dto.CvvNo,
                AddressId = dto.AddressId,
                PaymentMode = dto.PaymentMode,
                TotalAmount = dto.TotalAmount,
                CreatedDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var subject = "Foodie - Payment Confirmation";
            var body = $@"
                <h2>Thank you for your payment!</h2>
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Payment Mode:</strong> {dto.PaymentMode}</p>
                <p><strong>Total Amount:</strong> ₹{dto.TotalAmount:F2}</p>
                <p><strong>Date:</strong> {DateTime.UtcNow:dd MMM yyyy}</p>
                <hr />
                <p>We appreciate your order. Your payment was successful!</p>";

            try
            {
                await SendEmailAsync(userEmail, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }

            return Ok(new { message = "Payment added successfully", payment.PaymentId });
        }

        // GET: api/payment/getPaymentById/{id}
        [HttpGet("getPaymentById/{id}")]
        public async Task<ActionResult<PaymentDto>> GetPaymentById(int id)
        {
            var payment = await _context.Payments
                .AsNoTracking()
                .Where(p => p.PaymentId == id)
                .Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    Name = p.Name,
                    ExpiryDate = p.ExpiryDate,
                    AddressId = p.AddressId,
                    PaymentMode = p.PaymentMode,
                    TotalAmount = p.TotalAmount
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound(new { message = "Payment not found." });

            return Ok(payment);
        }

        // GET: api/payment/allPayments
        [HttpGet("allPayments")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAllPayments()
        {
            var payments = await _context.Payments
                .AsNoTracking()
                .Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    Name = p.Name,
                    ExpiryDate = p.ExpiryDate,
                    AddressId = p.AddressId,
                    PaymentMode = p.PaymentMode,
                    TotalAmount = p.TotalAmount
                })
                .ToListAsync();

            return Ok(payments);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var fromEmail = _configuration["EmailSettings:From"];
            var appPassword = _configuration["EmailSettings:AppPassword"];

            using (var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromEmail, appPassword),
                EnableSsl = true,
            })
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Foodie Ordering"),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
            }
        }
    }
}
