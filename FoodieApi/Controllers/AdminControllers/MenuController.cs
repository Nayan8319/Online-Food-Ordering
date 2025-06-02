using FoodieApi.Models;
using FoodieApi.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.RegularExpressions;

namespace FoodieApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MenuController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;
        private readonly IWebHostEnvironment _env;

        public MenuController(FoodieOrderningContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            return await _context.Menus
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuDto>> GetMenuById(int id)
        {
            var menu = await _context.Menus
                .Where(m => m.MenuId == id)
                .Select(m => new MenuDto
                {
                    MenuId = m.MenuId,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price,
                    Quantity = m.Quantity,
                    ImageUrl = m.ImageUrl,
                    CategoryId = m.CategoryId,
                    IsActive = m.IsActive
                }).FirstOrDefaultAsync();

            if (menu == null) return NotFound();

            return Ok(menu);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromForm] CreateMenuDto dto, IFormFile? image)
        {
            string? finalImageUrl = null;

            try
            {
                if (image != null && image.Length > 0)
                {
                    finalImageUrl = await SaveImageFile(image);
                }
                else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
                {
                    if (dto.ImageUrl.StartsWith("data:image"))
                        finalImageUrl = SaveBase64Image(dto.ImageUrl);
                    else if (IsAbsoluteUrl(dto.ImageUrl))
                        finalImageUrl = await DownloadImageFromUrlAsync(dto.ImageUrl);
                    else if (IsRelativeImagePath(dto.ImageUrl))
                        finalImageUrl = dto.ImageUrl;
                    else
                        return BadRequest("Invalid image URL format.");
                }
                else
                {
                    return BadRequest("Provide either an image file, base64 string, or a valid image URL.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Image processing failed: {ex.Message}");
            }

            var menu = new Menu
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                CategoryId = dto.CategoryId,
                ImageUrl = finalImageUrl,
                IsActive = dto.IsActive,
                CreatedDate = DateTime.Now
            };

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return Ok("Menu item created successfully.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromForm] CreateMenuDto dto, IFormFile? image)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null) return NotFound();

            menu.Name = dto.Name;
            menu.Description = dto.Description;
            menu.Price = dto.Price;
            menu.Quantity = dto.Quantity;
            menu.CategoryId = dto.CategoryId;
            menu.IsActive = dto.IsActive;

            try
            {
                if (image != null && image.Length > 0)
                {
                    var newImageUrl = await SaveImageFile(image);
                    DeleteImageFile(menu.ImageUrl);
                    menu.ImageUrl = newImageUrl;
                }
                else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
                {
                    string newImageUrl;

                    if (dto.ImageUrl.StartsWith("data:image"))
                        newImageUrl = SaveBase64Image(dto.ImageUrl);
                    else if (IsAbsoluteUrl(dto.ImageUrl))
                        newImageUrl = await DownloadImageFromUrlAsync(dto.ImageUrl);
                    else if (IsRelativeImagePath(dto.ImageUrl))
                        newImageUrl = dto.ImageUrl;
                    else
                        return BadRequest("Invalid image URL format.");

                    if (menu.ImageUrl != newImageUrl)
                    {
                        DeleteImageFile(menu.ImageUrl);
                        menu.ImageUrl = newImageUrl;
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Image processing failed: {ex.Message}");
            }

            await _context.SaveChangesAsync();
            return Ok("Menu item updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null) return NotFound();

            DeleteImageFile(menu.ImageUrl);

            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();
            return Ok("Menu item deleted.");
        }

        // --- Helper methods ---

        private async Task<string> SaveImageFile(IFormFile image)
        {
            string folderPath = Path.Combine(_env.WebRootPath, "MenuImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            string filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return "/MenuImages/" + fileName;
        }

        private async Task<string> DownloadImageFromUrlAsync(string imageUrl)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");
            httpClient.DefaultRequestHeaders.Add("Accept", "image/*");

            var response = await httpClient.GetAsync(imageUrl);
            response.EnsureSuccessStatusCode();

            var imageBytes = await response.Content.ReadAsByteArrayAsync();
            string folderPath = Path.Combine(_env.WebRootPath, "MenuImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string extension = Path.GetExtension(imageUrl).Split('?')[0];
            if (string.IsNullOrWhiteSpace(extension) || !extension.Contains(".")) extension = ".jpg";

            string fileName = Guid.NewGuid() + extension;
            string filePath = Path.Combine(folderPath, fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            return "/MenuImages/" + fileName;
        }

        private string SaveBase64Image(string base64Image)
        {
            var match = Regex.Match(base64Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (!match.Success)
                throw new ArgumentException("Invalid base64 image format.");

            var ext = match.Groups["type"].Value;
            var base64Data = match.Groups["data"].Value;

            byte[] imageBytes = Convert.FromBase64String(base64Data);

            string folderPath = Path.Combine(_env.WebRootPath, "MenuImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid() + "." + ext;
            string filePath = Path.Combine(folderPath, fileName);

            System.IO.File.WriteAllBytes(filePath, imageBytes);

            return "/MenuImages/" + fileName;
        }

        private void DeleteImageFile(string? imageUrl)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(imageUrl)) return;

                string path = Path.Combine(_env.WebRootPath, imageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }
            catch
            {
                // Optional: log error
            }
        }

        private bool IsAbsoluteUrl(string url)
        {
            return Uri.IsWellFormedUriString(url, UriKind.Absolute);
        }

        private bool IsRelativeImagePath(string url)
        {
            return url.StartsWith("/MenuImages/");
        }
    }
}
