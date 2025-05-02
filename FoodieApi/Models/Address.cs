using System;
using System.Collections.Generic;

namespace FoodieApi.Models;

public partial class Address
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string Street { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public int ZipCode { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User User { get; set; } = null!;
}
