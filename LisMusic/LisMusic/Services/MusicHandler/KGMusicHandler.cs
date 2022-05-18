using LisMusic.Common;
using LisMusic.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.IO;

namespace LisMusic.Services.MusicHandler
{
    public class KGMusicHandler : IMusicHandler
    {
        private readonly MusicSource _musicSource = MusicSource.KG;
        private readonly MusicHttpClient _httpClient;
        private readonly string KgMid;
        private readonly string KgDFID;

        //参数：<<KeyWord>>
        const string urlGetMusicList = "https://songsearch.kugou.com/song_search_v2?&keyword={0}&platform=WebFilter";
        //参数：<<FileHash>> <<kgDFID>> <<KgMid>>
        const string urlGetMusicDownloadUrl = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash={0}&dfid={1}&mid={2}";

        public KGMusicHandler(MusicHttpClient httpClient, IConfiguration configuration)
        {
            //httpClient.BaseAddress = new Uri("https://songsearch.kugou.com");

            _httpClient = httpClient;
            KgMid = configuration.GetValue<string>("MusicSettings:Kg:mid");
            KgDFID = configuration.GetValue<string>("MusicSettings:Kg:dfid");
        }

        public MusicSource MusicSource => _musicSource;

        public async Task<List<MusicInfo>> GetMusicListAsync(string keyWord)
        {
            List<MusicInfo> musicInfos = new List<MusicInfo>();

            try
            {
                string url = string.Format(urlGetMusicList, keyWord);
                string str = await _httpClient.GetAsync(url);
                JObject jo = JObject.Parse(str);
                for (int i = 0; i < jo["data"]["lists"].Count(); i++)
                {
                    bool bolCanDownload = true;
                    if (jo["data"]["lists"][i]["trans_param"]["musicpack_advance"].ToString() == "1") //该字段为1，则为收费，不可下载
                        bolCanDownload = false;

                    MusicInfo musicInfo = new MusicInfo()
                    {
                        Name = jo["data"]["lists"][i]["SongName"].ToString(),
                        Artist = jo["data"]["lists"][i]["SingerName"].ToString(),
                        Album = jo["data"]["lists"][i]["AlbumName"].ToString(),
                        DownloadInfo = jo["data"]["lists"][i]["FileHash"].ToString(),
                        CanDownload = bolCanDownload,
                        MusicSource = MusicSource.KG
                    };

                    musicInfos.Add(musicInfo);
                }
            }
            catch { }

            return musicInfos;
        }

        public async Task<string> GetMusicUrlAsync(MusicInfo musicInfo)
        {
            if (string.IsNullOrEmpty(musicInfo.DownloadInfo))
            {
                throw new ArgumentNullException(nameof(musicInfo.DownloadInfo));
            }

            try
            {
                string url = string.Format(urlGetMusicDownloadUrl, musicInfo.DownloadInfo, KgDFID, KgMid);
                HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Get, url);
                message.Headers.Add("Referer", "https://www.kugou.com/");
                string str = await _httpClient.SendAsync(message);
                JObject jo = JObject.Parse(str);

                return jo["data"]["play_url"].ToString();
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<(Stream, string)> GetMusicAsync(MusicInfo musicInfo)
        {
            try
            {
                string strMusicUrl = await this.GetMusicUrlAsync(musicInfo); //获取url

                int n = strMusicUrl.LastIndexOf(".");
                string strMusicExtension = strMusicUrl.Substring(n, (strMusicUrl.Length - n)); //获取扩展名
                Stream stream = await _httpClient.GetStream(strMusicUrl); //获取音乐流

                return (stream, strMusicExtension);
            }
            catch
            {
                return (new MemoryStream(), string.Empty);
            }
        }
    }
}
