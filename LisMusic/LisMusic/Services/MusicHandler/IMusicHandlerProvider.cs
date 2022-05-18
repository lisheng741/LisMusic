using LisMusic.Models;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace LisMusic.Services.MusicHandler
{
    public interface IMusicHandlerProvider
    {
        /// <summary>
        /// 获取音乐列表
        /// </summary>
        /// <param name="keyWord">搜索关键词</param>
        /// <returns></returns>
        Task<List<MusicInfo>> GetMusicListAsync(string keyWord);

        /// <summary>
        /// 获取音乐下载地址
        /// </summary>
        /// <param name="musicInfo">音乐信息，必须包含DownloadInfo</param>
        /// <returns></returns>
        Task<string> GetMusicUrlAsync(MusicInfo musicInfo);

        /// <summary>
        /// 获取音乐。返回：Stream=音乐流，string=扩展名（一般为.mp3）
        /// </summary>
        /// <param name="musicInfo">音乐信息，必须包含DownloadInfo</param>
        /// <returns></returns>
        Task<(Stream, string)> GetMusicAsync(MusicInfo musicInfo);
    }
}
