using LisMusic.Common;
using LisMusic.Models;
using LisMusic.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly IMusicService _musicServices;

        public MusicController(IMusicService musicServices)
        {
            _musicServices = musicServices;
        }

        //获取音乐列表
        [HttpGet]
        [EnableCors("AllowCors")]
        [ResponseCache(Duration = 300, VaryByQueryKeys = new string[] { "keyWord" })]
        public async Task<IActionResult> GetMusicList(string keyWord) => await _musicServices.GetMusicListAsync(keyWord);

        //获取音乐播放地址
        [HttpGet]
        [ResponseCache(Duration = 300, VaryByQueryKeys = new string[] { "downloadInfo", "musicSource" })]
        public async Task<IActionResult> GetMusicUrl(string downloadInfo, MusicSource musicSource = MusicSource.KW)
            => await _musicServices.GetMusicUrlAsync(new MusicInfo() { DownloadInfo = downloadInfo, MusicSource = musicSource });

        //获取音乐
        [HttpGet]
        [ResponseCache(Duration = 300, VaryByQueryKeys = new string[] { "name", "downloadInfo", "musicSource" })]
        public async Task<IActionResult> GetMusic(string name, string downloadInfo, MusicSource musicSource = MusicSource.KW)
            => await _musicServices.GetMusicAsync(new MusicInfo() { Name = name, DownloadInfo = downloadInfo, MusicSource = musicSource });

    }
}
