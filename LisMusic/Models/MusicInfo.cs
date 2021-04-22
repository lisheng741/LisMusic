using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Models
{
    public enum MusicSource
    {
        /// <summary>
        /// 未知
        /// </summary>
        Unknown,

        /// <summary>
        /// QQ音乐
        /// </summary>
        QQ,

        /// <summary>
        /// 酷狗
        /// </summary>
        KG,

        /// <summary>
        /// 酷我
        /// </summary>
        KW,

        /// <summary>
        /// 网抑云
        /// </summary>
        WYY,
    }

    /// <summary>
    /// 歌曲信息
    /// </summary>
    public class MusicInfo
    {
        public int ID { get; set; }

        /// <summary>
        /// 歌名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 副标题
        /// </summary>
        public string Subheading { get; set; }

        /// <summary>
        /// 歌手
        /// </summary>
        public string Singer { get; set; }

        /// <summary>
        /// 专辑名
        /// </summary>
        public string Album { get; set; }

        /// <summary>
        /// 下载信息，如QQ音乐为mid，酷狗音乐为FileHash
        /// </summary>
        public string DownloadInfo { get; set; }

        /// <summary>
        /// 来源
        /// </summary>
        public MusicSource MusicSource { get; set; }

        /// <summary>
        /// 是否可下载
        /// </summary>
        public bool CanDownload { get; set; } = true;
    }
}
