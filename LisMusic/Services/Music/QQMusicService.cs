using LisMusic.Common;
using LisMusic.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public class QQMusicService : MusicHttpClient, IALLMusicService
    {
        private readonly MusicSource _musicSource = MusicSource.QQ;
        private readonly string QQGuid;
        private readonly string QQUin;

        //参数：<<KeyWord>>
        const string urlGetMusicList = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?new_json=1&w={0}&format=json";
        //参数：<<>> 用于拼凑
        const string urlGetMusic = "http://ws.stream.qqmusic.qq.com/";
        //参数：<<guid>> <<mid>> <<uin>>
        const string urlGetMusicDownloadUrl = "https://u.y.qq.com/cgi-bin/musicu.fcg?&data={\"req_0\":{\"module\":\"vkey.GetVkeyServer\",\"method\":\"CgiGetVkey\",\"param\":{\"guid\":\"{0}\",\"songmid\":[\"{1}\"],\"uin\":\"{2}\"}}}";

        public QQMusicService(HttpClient httpClient, IConfiguration configuration) : base(httpClient)
        {
            //httpClient.BaseAddress = new Uri("http://qqmusic.qq.com");

            QQGuid = configuration.GetValue<string>("MusicSettings:QQ:guid");
            QQUin = configuration.GetValue<string>("MusicSettings:QQ:uin");
        }

        public MusicSource MusicSource => _musicSource;


        public async Task<List<MusicInfo>> GetMusicListAsync(string keyWord)
        {
            List<MusicInfo> musicInfos = new List<MusicInfo>();

            try
            {
                string url = string.Format(urlGetMusicList, keyWord);
                string str = await base.GetAsync(url);
                JObject jo = JObject.Parse(str);
                for (int i = 0; i < jo["data"]["song"]["list"].Count(); i++)
                {
                    bool bolCanDownload = true;
                    if (jo["data"]["song"]["list"][i]["pay"]["pay_play"].ToString() == "1") //该字段为1，则为收费，不可下载
                        bolCanDownload = false;

                    MusicInfo musicInfo = new MusicInfo() { Name = jo["data"]["song"]["list"][i]["name"].ToString(), Subheading = jo["data"]["song"]["list"][i]["lyric"].ToString(), Singer = jo["data"]["song"]["list"][i]["singer"][0]["name"].ToString(), Album = jo["data"]["song"]["list"][i]["album"]["name"].ToString(), DownloadInfo = jo["data"]["song"]["list"][i]["mid"].ToString(), CanDownload = bolCanDownload, MusicSource = MusicSource.QQ };

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

            try
            {
                string url = string.Format(urlGetMusicDownloadUrl, QQGuid, musicInfo.DownloadInfo, QQUin);
                HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Get, url);
                message.Headers.Add("Referer", "https://y.qq.com/");
                string str = await base.SendAsync(message);
                JObject jo = JObject.Parse(str);

                return jo["req_0"]["data"]["midurlinfo"][0]["flowurl"].ToString();
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
                string strMusicUrl = await this.GetMusicUrlAsync(musicInfo);

                int n = strMusicUrl.LastIndexOf(".");
                string strMusicExtension = strMusicUrl.Substring(n, (strMusicUrl.Length - n)); //获取扩展名
                strMusicUrl = urlGetMusic + strMusicUrl;
                Stream stream = await base.GetStream(strMusicUrl); //获取音乐流

                return (stream, strMusicExtension);
            }
            catch
            {
                return (new MemoryStream(), string.Empty);
            }
        }


    }
}
