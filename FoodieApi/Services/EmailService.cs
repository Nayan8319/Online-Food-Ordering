using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace FoodieApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var fromEmail = _config["EmailSettings:From"];
            var appPassword = _config["EmailSettings:AppPassword"];

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromEmail, appPassword),
                EnableSsl = true
            };

            var message = new MailMessage(fromEmail, toEmail)
            {
                Subject = "Your OTP Code",
                Body = $"Your OTP code is: {otp}"
            };

            await smtpClient.SendMailAsync(message);
        }
    }
}
