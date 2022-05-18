using LisMusic.Common;
using LisMusic.Models;
using LisMusic.Services.MusicHandler;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public class MusicService : IMusicService
    {
        private readonly IMusicHandlerProvider _musicHandlerProvider;

        public MusicService(IMusicHandlerProvider musicHandlerProvider)
        {
            _musicHandlerProvider = musicHandlerProvider;
        }

        public async Task<IActionResult> GetMusicListAsync(string keyWord)
        {
            if (string.IsNullOrWhiteSpace(keyWord))
            {
                return ApiReturn.Fail(msg: "搜索关键词不能为空白！");
            }

            var musicInfos = await _musicHandlerProvider.GetMusicListAsync(keyWord);
            musicInfos = musicInfos.OrderBy(t => t.MusicSource).ToList();
            for (int i = 0; i < musicInfos.Count; i++)
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

            string result = await _musicHandlerProvider.GetMusicUrlAsync(musicInfo);

            return ApiReturn.Success(data: result);
        }

        public async Task<IActionResult> GetMusicAsync(MusicInfo musicInfo)
        {
            if (string.IsNullOrWhiteSpace(musicInfo.Name) || string.IsNullOrWhiteSpace(musicInfo.DownloadInfo))
            {
                return ApiReturn.Fail(msg: "参数不足！");
            }

            //不能用using，会关闭流 //问题：是否会持续占用内存？
            (Stream stream, string str) = await _musicHandlerProvider.GetMusicAsync(new MusicInfo());
            
            Music music = new Music()
            {
                Name = musicInfo.Name,
                Extension = str
            };

            return new FileStreamResult(stream, "audio/mp3; charset=utf-8") { FileDownloadName = music.GetFileName() };
        }
    }
}
