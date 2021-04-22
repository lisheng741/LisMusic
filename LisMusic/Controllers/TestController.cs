//using LisMusic.Models;
//using LisMusic.Services;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Threading.Tasks;

//namespace LisMusic.Controllers
//{
//    public class TestController : Controller
//    {
//        private readonly IEnumerable<IALLMusicService> _musicServices;

//        public TestController(IEnumerable<IALLMusicService> musicServices)
//        {
//            _musicServices = musicServices;
//        }

//        public IActionResult Index()
//        {
//            return View();
//        }

//        [HttpGet]
//        [ResponseCache(Duration = 10000)]
//        public async Task<IActionResult> GetMusic()
//        {
//            await Task.Delay(1);

//            IALLMusicService service = _musicServices.Where(t => t.MusicSource == MusicSource.KG).FirstOrDefault();


//            //"https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3"
//            (Stream stream, string str) = await service.GetMusicAsync(new MusicInfo()); //不能用using，会关闭流 //是否会持续占用内存？


//            stream.Position = 0;
//            if (stream.Length == 0)
//            {
//                return Content("xxx");
//            }

//            return File(stream, "audio/mp3; charset=utf-8", "xxx.mp3");
//        }

//        [HttpGet]
//        [ResponseCache(Duration = 10000)]
//        public async Task<IActionResult> GetMusic2()
//        {
//            await Task.Delay(1);

//            IALLMusicService service = _musicServices.Where(t => t.MusicSource == MusicSource.KG).FirstOrDefault();

//            //Stream stream = await service.GetMusicDownloadUrlAsync("https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3"); //不能用using，会关闭流 //报错：Cannot access a closed Stream. //是否会持续占用内存？

//            //HttpContext.Response.Body = await service.GetMusicDownloadUrlAsync("https://webfs.yun.kugou.com/202104042233/2398c6ef59a8184a9f34ba265e4b5ea1/G195/M02/0D/11/Aw4DAF5gRj2AIPWyAESogEZRJSc737.mp3");

//            (Stream stream, string str) = await service.GetMusicAsync(new MusicInfo());

//            stream.Position = 0;
//            if (stream.Length == 0)
//            {
//                return Error();
//            }
//            HttpContext.Response.Headers.Add("Content-Length", stream.Length.ToString());
//            HttpContext.Response.ContentType = "audio/mp3; charset=utf-8";
//            HttpContext.Response.Headers.Add("Content-Disposition", string.Format("attachment; filename= xxx.mp3"));
//            HttpContext.Response.Body = stream;

//            return new EmptyResult();
//            return Ok();
//            //return File(stream, "audio/mp3; charset=utf-8", "xxx.mp3");
//        }
//    }
//}
