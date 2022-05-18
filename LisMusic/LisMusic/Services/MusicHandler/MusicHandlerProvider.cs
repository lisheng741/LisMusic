using LisMusic.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Services.MusicHandler
{
    public class MusicHandlerProvider : IMusicHandlerProvider
    {
        private readonly IEnumerable<IMusicHandler> _musicHandlers;

        public MusicHandlerProvider(IEnumerable<IMusicHandler> musicHandlers)
        {
            _musicHandlers = musicHandlers;
        }

        /// <summary>
        /// 获取音乐列表
        /// </summary>
        /// <param name="keyWord">搜索关键词</param>
        /// <returns></returns>
        public async Task<List<MusicInfo>> GetMusicListAsync(string keyWord)
        {
            List<Task<List<MusicInfo>>> tasks = new List<Task<List<MusicInfo>>>();
            foreach (IMusicHandler musicHandler in _musicHandlers)
            {
                tasks.Add(musicHandler.GetMusicListAsync(keyWord));
            }
            await Task.WhenAll(tasks); // 等待4个搜索任务都完成

            List<MusicInfo> musicInfos = new List<MusicInfo>();
            foreach (var task in tasks)
            {
                musicInfos.AddRange(task.Result);
            }

            return musicInfos;
        }

        /// <summary>
        /// 获取音乐下载地址
        /// </summary>
        /// <param name="musicInfo">音乐信息，必须包含DownloadInfo</param>
        /// <returns></returns>
        public async Task<string> GetMusicUrlAsync(MusicInfo musicInfo)
        {
            IMusicHandler service = _musicHandlers.Where(t => t.MusicSource == musicInfo.MusicSource)
                                                  .FirstOrDefault();
            if(service == null)
            {
                throw new ArgumentNullException(nameof(service), "无法找到指定音乐服务，可能该服务已经关闭！");
            }

            string result = await service.GetMusicUrlAsync(musicInfo);

            return result;
        }

        /// <summary>
        /// 获取音乐。返回：Stream=音乐流，string=扩展名（一般为.mp3）
        /// </summary>
        /// <param name="musicInfo">音乐信息，必须包含DownloadInfo</param>
        /// <returns></returns>
        public async Task<(Stream, string)> GetMusicAsync(MusicInfo musicInfo)
        {
            IMusicHandler service = _musicHandlers.Where(t => t.MusicSource == musicInfo.MusicSource)
                                                  .FirstOrDefault();
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service), "无法找到指定音乐服务，可能该服务已经关闭！");
            }

            //不能用using，会关闭流 //问题：是否会持续占用内存？
            (Stream stream, string extension) = await service.GetMusicAsync(new MusicInfo());
            stream.Position = 0;

            return (stream, extension);
        }
    }
}
