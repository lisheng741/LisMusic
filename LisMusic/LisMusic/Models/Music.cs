namespace LisMusic.Models
{
    /// <summary>
    /// 音乐
    /// </summary>
    public class Music
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

        public Music() { }

        public Music(string name, string singer, string extension)
        {
            Name = name;
            Singer = singer;
            Extension = extension;
        }

        /// <summary>
        /// 获取音乐文件名
        /// </summary>
        /// <param name="nameType"></param>
        /// <returns></returns>
        public string GetFileName(MusicFileNameType nameType = MusicFileNameType.OnlyName)
        {
            //获取
            string strFileName = nameType switch
            {
                MusicFileNameType.OnlyName => $"{this.Name}{this.Extension}",
                MusicFileNameType.NameWithSinger1 => $"{this.Name}-{this.Singer}{this.Extension}",
                MusicFileNameType.NameWithSinger2 => $"{this.Name}({this.Singer}){this.Extension}",
                MusicFileNameType.NameWithSinger3 => $"{this.Name}[{this.Singer}]{this.Extension}",
                MusicFileNameType.SingerWithName => $"{this.Singer}-{this.Name}{this.Extension}",
                _ => ""
            };
            //替换特殊字符
            strFileName = strFileName.Replace("/", "_")
                                    .Replace(@"\", "_")
                                    .Replace(":", "_")
                                    .Replace("*", "_")
                                    .Replace("?", "_")
                                    .Replace("\"", "_")
                                    .Replace(@"'", "_")
                                    .Replace("<", "_")
                                    .Replace(">", "_")
                                    .Replace("|", "_");

            return strFileName;
        }
    }
}
