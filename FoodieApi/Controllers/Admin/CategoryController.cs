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
    public class CategoryController : ControllerBase
    {
        private readonly FoodieOrderningContext _context;
        private readonly IWebHostEnvironment _env;

        public CategoryController(FoodieOrderningContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            return await _context.Categories
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    IsActive = c.IsActive
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
        {
            var category = await _context.Categories
                .Where(c => c.CategoryId == id)
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ImageUrl = c.ImageUrl,
                    IsActive = c.IsActive
                }).FirstOrDefaultAsync();

            if (category == null) return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromForm] CreateCategoryDto dto, IFormFile? image)
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

            var category = new Category
            {
                Name = dto.Name,
                ImageUrl = finalImageUrl,
                IsActive = dto.IsActive,
                CreatedDate = DateTime.Now
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok("Category created successfully.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromForm] CreateCategoryDto dto, IFormFile? image)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.IsActive = dto.IsActive;

            try
            {
                if (image != null && image.Length > 0)
                {
                    var newImageUrl = await SaveImageFile(image);
                    DeleteImageFile(category.ImageUrl);
                    category.ImageUrl = newImageUrl;
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

                    if (category.ImageUrl != newImageUrl)
                    {
                        DeleteImageFile(category.ImageUrl);
                        category.ImageUrl = newImageUrl;
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Image processing failed: {ex.Message}");
            }

            await _context.SaveChangesAsync();
            return Ok("Category updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Menus)
                .FirstOrDefaultAsync(c => c.CategoryId == id);

            if (category == null) return NotFound();

            if (category.Menus.Any())
                return BadRequest("Cannot delete category because it is associated with existing products.");

            DeleteImageFile(category.ImageUrl);

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok("Category deleted.");
        }

        private async Task<string> SaveImageFile(IFormFile image)
        {
            string folderPath = Path.Combine(_env.WebRootPath, "CategoryImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            string filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return "/CategoryImages/" + fileName;
        }

        private async Task<string> DownloadImageFromUrlAsync(string imageUrl)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");
            httpClient.DefaultRequestHeaders.Add("Accept", "image/*");

            var response = await httpClient.GetAsync(imageUrl);
            response.EnsureSuccessStatusCode();

            var imageBytes = await response.Content.ReadAsByteArrayAsync();
            string folderPath = Path.Combine(_env.WebRootPath, "CategoryImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string extension = Path.GetExtension(imageUrl).Split('?')[0];
            if (string.IsNullOrWhiteSpace(extension) || !extension.Contains(".")) extension = ".jpg";

            string fileName = Guid.NewGuid() + extension;
            string filePath = Path.Combine(folderPath, fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            return "/CategoryImages/" + fileName;
        }

        private string SaveBase64Image(string base64Image)
        {
            var match = Regex.Match(base64Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (!match.Success)
                throw new ArgumentException("Invalid base64 image format.");

            var ext = match.Groups["type"].Value;
            var base64Data = match.Groups["data"].Value;

            byte[] imageBytes = Convert.FromBase64String(base64Data);

            string folderPath = Path.Combine(_env.WebRootPath, "CategoryImages");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid() + "." + ext;
            string filePath = Path.Combine(folderPath, fileName);

            System.IO.File.WriteAllBytes(filePath, imageBytes);

            return "/CategoryImages/" + fileName;
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
            return url.StartsWith("/CategoryImages/");
        }
    }
}
