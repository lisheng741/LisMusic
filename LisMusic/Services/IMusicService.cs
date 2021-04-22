using LisMusic.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public interface IMusicService
    {
        /// <summary>
        /// 获取音乐列表
        /// </summary>
        /// <param name="keyWord">搜索关键词</param>
        /// <returns></returns>
        Task<IActionResult> GetMusicListAsync(string keyWord);

        /// <summary>
        /// 获取音乐url
        /// </summary>
        /// <param name="musicInfo">音乐信息</param>
        /// <returns></returns>
        Task<IActionResult> GetMusicUrlAsync(MusicInfo musicInfo);

        /// <summary>
        /// 获取音乐文件
        /// </summary>
        /// <param name="musicInfo">音乐信息</param>
        /// <returns></returns>
        Task<IActionResult> GetMusicAsync(MusicInfo musicInfo);
    }
}
