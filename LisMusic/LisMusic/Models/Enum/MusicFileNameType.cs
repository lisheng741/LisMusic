namespace LisMusic.Models
{
    /// <summary>
    /// 音乐文件命名类型
    /// </summary>
    public enum MusicFileNameType
    {
        /// <summary>
        /// 歌曲名。如：九万字.mp3
        /// </summary>
        OnlyName,

        /// <summary>
        /// 歌曲名-歌手1。如：九万字-黄诗扶.mp3
        /// </summary>
        NameWithSinger1,

        /// <summary>
        /// 歌曲名-歌手2。如：九万字(黄诗扶).mp3
        /// </summary>
        NameWithSinger2,

        /// <summary>
        /// 歌曲名-歌手3。如：九万字[黄诗扶].mp3
        /// </summary>
        NameWithSinger3,

        /// <summary>
        /// 歌手-歌曲名。如：黄诗扶-九万字.mp3
        /// </summary>
        SingerWithName
    }
}
