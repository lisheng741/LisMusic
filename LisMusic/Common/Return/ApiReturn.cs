using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace LisMusic.Common
{
    /// <summary>
    /// 返回码
    /// </summary>
    public enum ReturnCode
    {
        /// <summary>
        /// 成功：0
        /// </summary>
        Success = 0,
        Fail,
        Error,
        NotPermission,
        NotFound = 404,
    }

    /// <summary>
    /// API接口统一返回Json
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    public class ApiReturn
    {
        /// <summary>
        /// 返回码
        /// </summary>
        public ReturnCode code { get; set; }

        /// <summary>
        /// 返回状态，一般5个字符内
        /// </summary>
        public string status { get; set; }

        /// <summary>
        /// 详细消息
        /// </summary>
        public string msg { get; set; }

        /// <summary>
        /// 返回数据
        /// </summary>
        public object data { get; set; }

        public ApiReturn() { }

        public ApiReturn(ReturnCode returnCode, string status = null, string msg = null)
        {
            this.code = returnCode;
            this.status = status ?? returnCode switch
            {
                ReturnCode.Success => "成功！",
                ReturnCode.Fail => "失败！",
                ReturnCode.Error => "错误！",
                ReturnCode.NotPermission => "没有权限！",
                ReturnCode.NotFound => "没有找到！",
                _ => ""
            };
            this.msg = msg ?? returnCode switch
            {
                ReturnCode.Success => "成功！",
                ReturnCode.Fail => "失败！",
                ReturnCode.Error => "错误！",
                ReturnCode.NotPermission => "没有权限！",
                ReturnCode.NotFound => "没有找到！",
                _ => ""
            };
        }

        public ApiReturn(ReturnCode returnCode, object data, string status = null, string msg = null) : this(returnCode, status, msg)
        {
            this.data = data;
        }

        /// <summary>
        /// 通用返回Json，返回当前实例
        /// </summary>
        /// <returns></returns>
        public JsonResult Common()
        {
            return new JsonResult(this);
        }

        #region 静态方法

        /// <summary>
        /// 通用返回Json
        /// </summary>
        /// <param name="apiReturn"></param>
        /// <returns></returns>
        public static JsonResult Common(ApiReturn apiReturn)
        {
            return new JsonResult(apiReturn);
        }

        public static JsonResult Success(string status = "成功！", string msg = "成功！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Success, status = status, msg = msg });
        }

        public static JsonResult Success(object data, string status = "成功！", string msg = "成功！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Success, status = status, msg = msg, data = data });
        }

        public static JsonResult Fail(string status = "失败！", string msg = "失败！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Fail, status = status, msg = msg });
        }

        public static JsonResult Fail(object data, string status = "失败！", string msg = "失败！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Fail, status = status, msg = msg, data = data });
        }

        public static JsonResult Error(string status = "错误！", string msg = "错误！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Error, status = status, msg = msg });
        }

        public static JsonResult Error(object data, string status = "错误！", string msg = "错误！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.Error, status = status, msg = msg, data = data });
        }

        public static JsonResult NotPermission(string status = "没有权限！", string msg = "没有权限！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.NotPermission, status = status, msg = msg });
        }

        public static JsonResult NotFound(string status = "没有找到！", string msg = "没有找到！")
        {
            return new JsonResult(new ApiReturn() { code = ReturnCode.NotFound, status = status, msg = msg });
        }

        #endregion
    }
}
