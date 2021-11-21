using LisMusic.Common;
using LisMusic.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public class KWMusicService : IALLMusicService
    {
        private readonly MusicSource _musicSource = MusicSource.KW;
        private readonly MusicHttpClient _httpClient;

        //参数：<<KeyWord>>
        const string urlGetMusicList1 = "http://www.kuwo.cn/search/list?key={0}";//新搜索，分两步，两个url
        const string urlGetMusicList2 = "http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key={0}&pn=1&rn=30&reqId=";
        //const string urlGetMusicList = "http://sou.kuwo.cn/ws/NSearch?type=music&key={0}";//旧搜索URL，返回html
        //参数：<<MUSICID>> //旧下载接口，可下vip
        const string urlGetMusicDownloadUrl = "http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid={0}&type=convert_url&response=res";

        public KWMusicService(MusicHttpClient httpClient)
        {
            //httpClient.BaseAddress = new Uri("http://sou.kuwo.cn");

            _httpClient = httpClient;
        }

        public MusicSource MusicSource => _musicSource;

        public async Task<List<MusicInfo>> GetMusicListAsync(string keyWord)
        {
            List<MusicInfo> musicInfos = new List<MusicInfo>();

            try
            {
                //第一步，获取 头部csrf
                string url1 = string.Format(urlGetMusicList1, keyWord);
                await _httpClient.GetAsync(url1);
                string strKwToken = _httpClient.GetCookie("kw_token");
                //第二步，获取 列表
                string url2 = string.Format(urlGetMusicList2, keyWord);
                HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Get, url2);
                message.Headers.Add("Referer", url1);
                message.Headers.Add("csrf", strKwToken);
                string str = await _httpClient.SendAsync(message);
                //解析列表
                JObject jo = JObject.Parse(str);
                for (int i = 0; i < jo["data"]["list"].Count(); i++)
                {
                    bool bolCanDownload = true;
                    //旧接口下载，高品质而且vip可下
                    //if (jo["data"]["lists"][i]["pay"].ToString() == "16711935") //该字段为16711935，则为收费，不可下载
                    //    bolCanDownload = false;

                    MusicInfo musicInfo = new MusicInfo()
                    {
                        Name = jo["data"]["list"][i]["name"].ToString(),
                        Artist = jo["data"]["list"][i]["artist"].ToString(),
                        Album = jo["data"]["list"][i]["album"].ToString(),
                        DownloadInfo = jo["data"]["list"][i]["musicrid"].ToString(),
                        CanDownload = bolCanDownload,
                        MusicSource = MusicSource.KW
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
                throw new ArgumentNullException(nameof(musicInfo.DownloadInfo));

            string strMusicUrl = string.Format(urlGetMusicDownloadUrl, musicInfo.DownloadInfo);
            return strMusicUrl;
        }

        public async Task<(Stream, string)> GetMusicAsync(MusicInfo musicInfo)
        {
            try
            {
                string strMusicUrl = await this.GetMusicUrlAsync(musicInfo);

                string strMusicExtension = ".mp3"; //扩展名
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
