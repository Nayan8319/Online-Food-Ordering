using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public int CvvNo { get; set; }

    public int AddressId { get; set; }

    public string PaymentMode { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual Address Address { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
