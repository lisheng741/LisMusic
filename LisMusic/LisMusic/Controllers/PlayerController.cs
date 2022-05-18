using LisMusic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

namespace LisMusic.Controllers
{
    public class PlayerController : Controller
    {
        private readonly IConfiguration _configuration;

        public PlayerController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index([FromQuery] MusicShare musicShare)
        {
            string jsonMusicShare;
            if (!MusicShare.IsNullOrEmpty(musicShare))
            {
                jsonMusicShare = JsonSerializer.Serialize(musicShare,
                    new JsonSerializerOptions() { 
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        Encoder = JavaScriptEncoder.Create(UnicodeRanges.All), // 编码
                        IgnoreNullValues = true
                    }
                );
            }
            else
            {
                jsonMusicShare = "{}";
            }

            string domain = _configuration["URL:Domain"];

            ViewData["MusicShare"] = jsonMusicShare;
            ViewData["Domain"] = domain;
            return View();
        }
    }
}
