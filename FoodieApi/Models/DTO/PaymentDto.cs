using System;
using System.ComponentModel.DataAnnotations;

namespace FoodieApi.Models.DTO
{
    // DTO for creating a new payment (used in addPayment and addPaymentAndPlaceOrder)
    public class CreatePaymentDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public int CvvNo { get; set; }

        [Required]
        public int AddressId { get; set; }

        [Required]
        public string PaymentMode { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }
    }

    // DTO for placing order with an existing payment
    public class PlaceOrderWithPaymentDto
    {
        [Required]
        public int PaymentId { get; set; }
    }

    // DTO for returning payment details in GET responses
    public class PaymentDto
    {
        public int PaymentId { get; set; }

        public string Name { get; set; }

        public DateTime ExpiryDate { get; set; }

        public int AddressId { get; set; }

        public string PaymentMode { get; set; }

        public decimal TotalAmount { get; set; }
    }
}
