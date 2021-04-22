using LisMusic.Common;
using LisMusic.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LisMusic.Services
{
    public class WYYMusicService : MusicHttpClient, IALLMusicService
    {
        private readonly MusicSource _musicSource = MusicSource.WYY;
        private readonly string WyyIv;
        //private readonly string WyyParameter1;
        private readonly string WyyParameter2;
        private readonly string WyyParameter3;
        private readonly string WyyParameter4;
        private readonly string WyyParameter1_List;
        private readonly string WyyParameter1_Download;

        const string urlGetMusicList = "/weapi/cloudsearch/get/web?csrf_token=";
        const string urlGetMusicDownloadUrl = "/weapi/song/enhance/player/url/v1?csrf_token=";

        public WYYMusicService(HttpClient httpClient, IConfiguration configuration) : base(httpClient)
        {
            httpClient.BaseAddress = new Uri("https://music.163.com/");

            WyyIv = "0102030405060708";
            WyyParameter2 = "010001";
            WyyParameter3 = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
            WyyParameter4 = "0CoJUm6Qyw8W8jud";
            WyyParameter1_List = "{{\"hlpretag\":\"<span class=\\\"s-fc7\\\">\",\"hlposttag\":\"</span>\",\"s\":\"{0}\",\"type\":\"1\",\"offset\":\"0\",\"total\":\"true\",\"limit\":\"10\",\"csrf_token\":\"\"}}"; //<<KeyWord>>
            WyyParameter1_Download = "{{\"ids\":\"[{0}]\",\"level\":\"standard\",\"encodeType\":\"aac\",\"csrf_token\":\"\"}}"; //<<ID>>
        }

        public MusicSource MusicSource => _musicSource;

        public async Task<List<MusicInfo>> GetMusicListAsync(string keyWord)
        {
            List<MusicInfo> musicInfos = new List<MusicInfo>();

            try
            {
                string url = urlGetMusicList;
                //两次AES加密，得到 Parameter1（对应参数中的params）
                string strParameter1 = string.Format(WyyParameter1_List, keyWord);
                strParameter1 = Encrypt.AESEncrypt(strParameter1, WyyParameter4, WyyIv);
                string strRandom16 = GetRandomString(16); //随机16位字符
                strParameter1 = Encrypt.AESEncrypt(strParameter1, strRandom16, WyyIv);
                //特定RSA加密，得到 encSecKey
                string encSecKey = RsaEncrypt(strRandom16, WyyParameter2, WyyParameter3);
                string str = await base.PostAsync(url, new { @params = strParameter1, encSecKey = encSecKey });
                JObject jo = JObject.Parse(str);
                for (int i = 0; i < jo["result"]["songs"].Count(); i++)
                {
                    bool bolCanDownload = true; //重置
                    if (jo["result"]["songs"][i]["privilege"]["fl"].ToString() == "0") //该字段为0，则为不可下载（歌名灰色）
                        bolCanDownload = false;

                    //副标题 jo["result"]["songs"][i]["alia"].ToString() 多为[]，需要清洗，干脆不要了
                    MusicInfo musicInfo = new MusicInfo() { Name = jo["result"]["songs"][i]["name"].ToString(), Singer = jo["result"]["songs"][i]["ar"][0]["name"].ToString(), Album = jo["result"]["songs"][i]["al"]["name"].ToString(), DownloadInfo = jo["result"]["songs"][i]["id"].ToString(), CanDownload = bolCanDownload, MusicSource = MusicSource.WYY };

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
                string url = urlGetMusicDownloadUrl;
                string strParameter1 = string.Format(WyyParameter1_Download, musicInfo.DownloadInfo);
                strParameter1 = Encrypt.AESEncrypt(strParameter1, WyyParameter4, WyyIv);
                string strRandom16 = GetRandomString(16); //随机16位字符
                strParameter1 = Encrypt.AESEncrypt(strParameter1, strRandom16, WyyIv);
                string encSecKey = RsaEncrypt(strRandom16, WyyParameter2, WyyParameter3); //特定RSA加密
                string str = await base.PostAsync(url, new { @params = strParameter1, encSecKey = encSecKey });

                JObject jo = JObject.Parse(str);
                return jo["data"][0]["url"].ToString();
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
                Stream stream = await base.GetStream(strMusicUrl); //获取音乐流

                return (stream, strMusicExtension);
            }
            catch
            {
                return (new MemoryStream(), string.Empty);
            }
        }

        /// <summary>
        /// 生成随机字符
        /// </summary>
        /// <param name="length">随机字符长度</param>
        /// <returns></returns>
        private string GetRandomString(int length)
        {
            string str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                sb.Append(str[random.Next(str.Length)]);
            }
            return sb.ToString();
        }

        /// <summary>
        /// 针对网易云的 Rsa 加密，参考：https://github.com/darknessomi/musicbox/wiki/网易云音乐新登录API分析
        /// </summary>
        /// <param name="data">明文</param>
        /// <param name="pubKey">网易云第2个参数</param>
        /// <param name="moduls">网易云第3个参数</param>
        /// <returns></returns>
        private string RsaEncrypt(string data, string pubKey, string moduls)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(data.Reverse().ToArray());
            BigInteger text = new BigInteger(bytes);
            BigInteger p2 = new BigInteger(pubKey, 16);
            BigInteger p3 = new BigInteger(moduls, 16);
            BigInteger rs = text.modPow(p2, p3);
            return rs.ToHexString().ToLower().PadLeft(256, '0'); //256位，左部补0
        }

    }
}
