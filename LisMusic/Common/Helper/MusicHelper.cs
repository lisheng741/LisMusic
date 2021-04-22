using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Common
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

    public class MusicHelper
    {
        /// <summary>
        /// 歌曲名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 歌手
        /// </summary>
        public string Singer { get; set; }

        /// <summary>
        /// 扩展名
        /// </summary>
        public string Extension { get; set; }

        public string GetFileName(MusicFileNameType nameType = MusicFileNameType.OnlyName)
        {
            //获取
            string strFileName =  nameType switch
            {
                MusicFileNameType.OnlyName => $"{this.Name}{this.Extension}",
                MusicFileNameType.NameWithSinger1 => $"{this.Name}-{this.Singer}{this.Extension}",
                MusicFileNameType.NameWithSinger2 => $"{this.Name}({this.Singer}){this.Extension}",
                MusicFileNameType.NameWithSinger3 => $"{this.Name}[{this.Singer}]{this.Extension}",
                MusicFileNameType.SingerWithName => $"{this.Singer}-{this.Name}{this.Extension}",
                _ => ""
            };
            //替换特殊字符
            strFileName.Replace("/", "_").Replace("\\", "_").Replace(":", "_").Replace("*", "_").Replace("?", "_").Replace("\"", "_").Replace("\'", "_").Replace("<", "_").Replace(">", "_").Replace("|", "_");

            return strFileName;
        }
    }
}
