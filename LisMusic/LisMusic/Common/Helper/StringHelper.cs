using System;
using System.Text;

namespace LisMusic.Common
{
    public static class StringHelper
    {
        /// <summary>
        /// 生成随机字符串
        /// </summary>
        /// <param name="length">随机字符串长度</param>
        /// <returns></returns>
        public static string GetRandomString(int length)
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
    }
}
