using LisMusic.Models;
using LisMusic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using LisMusic.Common;
using System.IO;
using LisMusic.Services.MusicHandler;

namespace LisMusic.Controllers
{
    /// <summary>
    /// 测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……
    /// 测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……测试用的……
    /// </summary>
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IEnumerable<IMusicHandler> _musicServices;

        public HomeController(ILogger<HomeController> logger, IEnumerable<IMusicHandler> musicServices)
        {
            _logger = logger;
            _musicServices = musicServices;
        }

        [HttpGet]
        [ResponseCache(Duration = 10000)]
        public async Task<IActionResult> GetMusic()
        {
            await Task.Delay(1);

            IMusicHandler service = _musicServices.Where(t => t.MusicSource == MusicSource.KG).FirstOrDefault();


            //"https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3"
            (Stream stream, string str) = await service.GetMusicAsync(new MusicInfo()); //不能用using，会关闭流 //是否会持续占用内存？


            stream.Position = 0;
            if (stream.Length == 0)
            {
                return Content("xxx");
            }

            return File(stream, "audio/mp3; charset=utf-8", "xxx.mp3");
        }

        [HttpGet]
        [ResponseCache(Duration = 10000)]
        public async Task<IActionResult> GetMusic2()
        {
            await Task.Delay(1);

            IMusicHandler service = _musicServices.Where(t => t.MusicSource == MusicSource.KG).FirstOrDefault();

            //Stream stream = await service.GetMusicDownloadUrlAsync("https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3"); //不能用using，会关闭流 //报错：Cannot access a closed Stream. //是否会持续占用内存？

            //HttpContext.Response.Body = await service.GetMusicDownloadUrlAsync("https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3");

            (Stream stream, string str) = await service.GetMusicAsync(new MusicInfo());

            stream.Position = 0;
            if (stream.Length == 0)
            {
                return Error();
            }
            HttpContext.Response.Headers.Add("Content-Length", stream.Length.ToString());
            HttpContext.Response.ContentType = "audio/mp3; charset=utf-8";
            HttpContext.Response.Headers.Add("Content-Disposition", string.Format("attachment; filename= xxx.mp3"));
            HttpContext.Response.Body = stream;

            return new EmptyResult();
            return Ok();
            //return File(stream, "audio/mp3; charset=utf-8", "xxx.mp3");
        }

        public async Task<IActionResult> Index()
        {
            string keyWord = "九万字";

            //var musicService = _musicServices.Where(t => t.MusicSource == MusicSource.KW).FirstOrDefault();
            //List<MusicInfo> musicInfos = await musicService.GetMusicListAsync(keyWord);

            string sencrypt = Encrypt.AESEncrypt(keyWord, "0CoJUm6Qyw8W8jud", "0102030405060708");
            string deencrypt = Encrypt.AESDecrypt(sencrypt, "0CoJUm6Qyw8W8jud", "0102030405060708");

            return View();
        }

        public async Task<IActionResult> Index2()
        {
            string keyWord = "九万字";
            List<Task<List<MusicInfo>>> tasks = new List<Task<List<MusicInfo>>>();

            foreach(IMusicHandler musicService in _musicServices)
            {
                tasks.Add(musicService.GetMusicListAsync(keyWord));
            }

            await Task.WhenAll(tasks);
            Console.WriteLine("task");

            List<MusicInfo> musicInfos = new List<MusicInfo>();
            foreach(var task in tasks)
            {
                musicInfos.AddRange(task.Result);
            }
            Console.WriteLine(JsonConvert.SerializeObject(musicInfos));

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
