using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace FoodieApi.Controllers.UserControllers
{
    [Route("api/address")]
    [ApiController]
    [Authorize(Roles = "User,Admin")] // Only User role
    public class AddressController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;

        public AddressController(FoodieOrderningContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: api/address
        [HttpGet("allAddress")]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetUserAddresses()
        {
            int userId = GetUserId();

            var addresses = await _context.Addresses
                .Where(a => a.UserId == userId)
                .Select(a => new AddressDto
                {
                    AddressId = a.AddressId,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode
                })
                .ToListAsync();

            return Ok(addresses);
        }

        // GET: api/address/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDto>> GetAddressById(int id)
        {
            int userId = GetUserId();

            var address = await _context.Addresses
                .Where(a => a.UserId == userId && a.AddressId == id)
                .Select(a => new AddressDto
                {
                    AddressId = a.AddressId,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode
                })
                .FirstOrDefaultAsync();

            if (address == null)
                return NotFound("Address not found.");

            return Ok(address);
        }

        // POST: api/address
        [HttpPost("add")]
        public async Task<ActionResult<AddressDto>> AddAddress([FromBody] CreateAddressDto dto)
        {
            int userId = GetUserId();

            var newAddress = new Address
            {
                UserId = userId,
                Street = dto.Street,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode
            };

            _context.Addresses.Add(newAddress);
            await _context.SaveChangesAsync();

            var result = new AddressDto
            {
                AddressId = newAddress.AddressId,
                Street = newAddress.Street,
                City = newAddress.City,
                State = newAddress.State,
                ZipCode = newAddress.ZipCode
            };

            return CreatedAtAction(nameof(GetAddressById), new { id = result.AddressId }, result);
        }

        // PUT: api/address/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] CreateAddressDto dto)
        {
            int userId = GetUserId();

            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.UserId == userId && a.AddressId == id);

            if (address == null)
                return NotFound("Address not found.");

            address.Street = dto.Street;
            address.City = dto.City;
            address.State = dto.State;
            address.ZipCode = dto.ZipCode;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/address/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            int userId = GetUserId();

            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.UserId == userId && a.AddressId == id);

            if (address == null)
                return NotFound("Address not found.");

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}