namespace LisMusic.Models
{
    /// <summary>
    /// 歌曲信息 DTO
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
        public string Artist { get; set; }

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
