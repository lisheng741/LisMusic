using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LisMusic.Common
{
    public static class Encrypt
    {
        /// <summary>
        /// AES加密 CBC模式 128位
        /// </summary>
        /// <param name="data">明文</param>
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns></returns>
        public static string AESEncrypt(string data, string key, string iv)
        {
            if (string.IsNullOrEmpty(data))
            {
                return string.Empty;
            }

            try
            {
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);
                byte[] keyBytes = new Byte[16];
                byte[] ivBytes = Encoding.UTF8.GetBytes(iv);
                Array.Copy(Encoding.UTF8.GetBytes(key.PadRight(16)), keyBytes, 16);
                RijndaelManaged aes = new RijndaelManaged();
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.KeySize = 128;
                aes.BlockSize = 128;
                aes.Key = keyBytes;
                aes.IV = ivBytes;
                ICryptoTransform ctf = aes.CreateEncryptor();
                byte[] resultBytes = ctf.TransformFinalBlock(dataBytes, 0, dataBytes.Length);

                return Convert.ToBase64String(resultBytes);
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// AES解密 CBC模式 128位
        /// </summary>
        /// <param name="data">密文</param>
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns></returns>
        public static string AESDecrypt(string data, string key, string iv)
        {
            if (string.IsNullOrEmpty(data))
            {
                return string.Empty;
            }

            try
            {
                byte[] dataBytes = Convert.FromBase64String(data);
                byte[] keyBytes = new Byte[16];
                byte[] ivBytes = Encoding.UTF8.GetBytes(iv);
                Array.Copy(Encoding.UTF8.GetBytes(key.PadRight(16)), keyBytes, 16);
                RijndaelManaged aes = new RijndaelManaged();
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.KeySize = 128;
                aes.BlockSize = 128;
                aes.Key = keyBytes;
                aes.IV = ivBytes;
                ICryptoTransform ctf = aes.CreateDecryptor();
                byte[] resultBytes = ctf.TransformFinalBlock(dataBytes, 0, dataBytes.Length);

                return UTF8Encoding.UTF8.GetString(resultBytes);
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
