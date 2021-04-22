using LisMusic.Common;
using LisMusic.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public class MusicService : IMusicService
    {
        private readonly IEnumerable<IALLMusicService> _musicServices;

        public MusicService(IEnumerable<IALLMusicService> musicServices)
        {
            _musicServices = musicServices;
        }

        public async Task<IActionResult> GetMusicListAsync(string keyWord)
        {
            if (string.IsNullOrWhiteSpace(keyWord))
            {
                return ApiReturn.Fail(msg: "搜索关键词不能为空白！");
            }

            List<Task<List<MusicInfo>>> tasks = new List<Task<List<MusicInfo>>>();
            foreach (IALLMusicService musicService in _musicServices)
            {
                tasks.Add(musicService.GetMusicListAsync(keyWord));
            }
            await Task.WhenAll(tasks); //等待4个搜索任务都完成

            List<MusicInfo> musicInfos = new List<MusicInfo>();
            foreach (var task in tasks)
            {
                musicInfos.AddRange(task.Result);
            }
            musicInfos = musicInfos.OrderBy(t => t.MusicSource).ToList();
            for(int i = 0; i < musicInfos.Count; i++)
            {
                musicInfos[i].ID = i;
            }

            return ApiReturn.Success(musicInfos);
        }

        public async Task<IActionResult> GetMusicUrlAsync(MusicInfo musicInfo)
        {
            if (string.IsNullOrWhiteSpace(musicInfo.DownloadInfo))
            {
                return ApiReturn.Fail(msg: "参数不足！");
            }
            IALLMusicService service = _musicServices.Where(t => t.MusicSource == musicInfo.MusicSource).FirstOrDefault();
            if (service == null)
            {
                return ApiReturn.Error(msg: "无法找到指定音乐服务，可能该服务已经关闭！"); //如果某个平台不给下载，注释 Startup 里面注入的服务，即关闭服务
            }
            string str = await service.GetMusicUrlAsync(musicInfo);

            return ApiReturn.Success(data: str);
        }

        public async Task<IActionResult> GetMusicAsync(MusicInfo musicInfo)
        {
            if (string.IsNullOrWhiteSpace(musicInfo.Name) || string.IsNullOrWhiteSpace(musicInfo.DownloadInfo))
            {
                return ApiReturn.Fail(msg: "参数不足！");
            }
            IALLMusicService service = _musicServices.Where(t => t.MusicSource == musicInfo.MusicSource).FirstOrDefault();
            if (service == null)
            {
                return ApiReturn.Error(msg: "无法找到指定音乐服务，可能该服务已经关闭！"); //如果某个平台不给下载，注释 Startup 里面注入的服务，即关闭服务
            }

            (Stream stream, string str) = await service.GetMusicAsync(new MusicInfo()); //不能用using，会关闭流 //是否会持续占用内存？
            stream.Position = 0;
            MusicHelper musicHelper = new MusicHelper() { Name = musicInfo.Name, Extension = str };

            return new FileStreamResult(stream, "audio/mp3; charset=utf-8") { FileDownloadName = musicHelper.GetFileName() };
        }
    }
}
