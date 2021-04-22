using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LisMusic.Common
{
    public enum ContentType
    {
        /// <summary>
        /// application/x-www-form-urlencoded
        /// </summary>
        AppForm,

        /// <summary>
        /// application/json
        /// </summary>
        AppJson,

        /// <summary>
        /// text/xml
        /// </summary>
        TxtXml
    }

    public class MusicHttpClient
    {
        protected readonly HttpClient _httpClient;
        protected HttpResponseMessage _httpResponse;
        protected readonly Encoding _encoding = Encoding.UTF8;

        public MusicHttpClient(HttpClient httpClient)
        {
            //httpClient.BaseAddress = new Uri("https://cnote.cn/");
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36");
            httpClient.Timeout = new TimeSpan(0,0,30); //30秒超时
            _httpClient = httpClient;
        }

        /// <summary>
        /// Send
        /// </summary>
        /// <param name="request">Http请求消息</param>
        /// <returns></returns>
        protected virtual async Task<string> SendAsync(HttpRequestMessage request)
        {
            using var response = await _httpClient.SendAsync(request);
            _httpResponse = response;
            //response.EnsureSuccessStatusCode();
            //using var responseStream = await response.Content.ReadAsStreamAsync();
            //return await JsonSerializer.DeserializeAsync<IEnumerable<string>>(responseStream);
            if (response.IsSuccessStatusCode)
            {
                return _encoding.GetString(await response.Content.ReadAsByteArrayAsync());
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Get方式，参数包含在url
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        protected virtual async Task<string> GetAsync(string url)
        {
            using var response = await _httpClient.GetAsync(url);
            _httpResponse = response;
            if (response.IsSuccessStatusCode)
            {
                return _encoding.GetString(await response.Content.ReadAsByteArrayAsync());
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Post方式
        /// </summary>
        /// <param name="url"></param>
        /// <param name="htpContent"></param>
        /// <returns></returns>
        protected virtual async Task<string> PostAsync(string url, HttpContent htpContent)
        {
            using var response = await _httpClient.PostAsync(url, htpContent);
            _httpResponse = response;
            if (response.IsSuccessStatusCode)
            {
                return _encoding.GetString(await response.Content.ReadAsByteArrayAsync());
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Post方式
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        protected virtual async Task<string> PostAsync(string url, object data, ContentType contentType = ContentType.AppForm)
        {
            HttpContent htpContent = contentType switch
            {
                ContentType.AppForm => new FormUrlEncodedContent(GetParamList(data)),
                ContentType.AppJson => new StringContent(JsonConvert.SerializeObject(data), _encoding, "application/json"),
                _ => null
            };

            return await this.PostAsync(url, htpContent);
        }

        /// <summary>
        /// Post方式。只能处理 ContentType.AppJson
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        protected virtual async Task<string> PostAsync(string url, string data, ContentType contentType = ContentType.AppJson)
        {
            HttpContent htpContent = contentType switch
            {
                ContentType.AppJson => new StringContent(data, _encoding, "application/json"),
                _ => null,
            };

            return await this.PostAsync(url, htpContent);
        }


        /// <summary>
        /// 获取最后一次正确响应的 cookie 值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        protected virtual string GetCookie(string key)
        {
            if(_httpResponse == null)
            {
                return string.Empty;
            }
            string str = _httpResponse.Headers.GetValues("Set-Cookie").FirstOrDefault();
            return Regex.Match(str, $"(^| ){key}=([^;]*)(;|$)").Groups[2].Value;
        }

        /// <summary>
        /// 获取流
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        protected virtual async Task<Stream> GetStream(string url)
        {
            using var response = await _httpClient.GetAsync(url);
            _httpResponse = response;
            if (response.IsSuccessStatusCode)
            {
                MemoryStream ms = new MemoryStream();
                using Stream stream = await response.Content.ReadAsStreamAsync();
                await stream.CopyToAsync(ms);

                ////创建一个byte数组，每次读512个字节
                //byte[] bytes = new byte[512];
                //int count = stream.Read(bytes, 0, 512); //首次读取

                //while (count > 0) //循环读取
                //{
                //    ms.Write(bytes, 0, count);
                //    count = stream.Read(bytes, 0, 512);
                //}
                return ms;
            }
            else
            {
                return new MemoryStream();
            }
        }

        //通过反射，将 objec 转为 KeyValuePair
        private List<KeyValuePair<string, string>> GetParamList(object data)
        {
            List<KeyValuePair<string, string>> paramList = new List<KeyValuePair<string, string>>();
            Type t = data.GetType();
            var properties = t.GetProperties().Where(t => t.CanRead).ToArray();
            for (int i = 0; i < properties.Length; i++)
            {
                KeyValuePair<string, string> key = new KeyValuePair<string, string>(properties[i].Name, properties[i].GetValue(data).ToString());
                paramList.Add(key);
            }
            return paramList;
        }
    }
}
