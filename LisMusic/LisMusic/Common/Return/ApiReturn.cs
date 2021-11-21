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
        NotPermission = 403,
        NotFound = 404,
    }

    /// <summary>
    /// API接口统一返回Json
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    public class ApiReturn
    {
        //常量定义
        const string StatusSuccess = "成功！";
        const string StatusFail = "失败！";
        const string StatusError = "发生错误！";
        const string StatusNotPermission = "没有权限！";
        const string StatusNotFound = "没有找到！";

        /// <summary>
        /// 返回码
        /// </summary>
        public ReturnCode Code { get; set; }

        /// <summary>
        /// 返回状态，一般5个字符内
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// 详细消息
        /// </summary>
        public string Msg { get; set; }

        /// <summary>
        /// 返回数据
        /// </summary>
        public object Data { get; set; }

        public ApiReturn() { }

        public ApiReturn(ReturnCode returnCode, string status = null, string msg = null)
        {
            this.Code = returnCode;
            this.Status = status ?? returnCode switch
            {
                ReturnCode.Success => StatusSuccess,
                ReturnCode.Fail => StatusFail,
                ReturnCode.Error => StatusError,
                ReturnCode.NotPermission => StatusNotPermission,
                ReturnCode.NotFound => StatusNotFound,
                _ => ""
            };
            this.Msg = msg ?? returnCode switch
            {
                ReturnCode.Success => StatusSuccess,
                ReturnCode.Fail => StatusFail,
                ReturnCode.Error => StatusError,
                ReturnCode.NotPermission => StatusNotPermission,
                ReturnCode.NotFound => StatusNotFound,
                _ => ""
            };
        }

        public ApiReturn(ReturnCode returnCode, object data, string status = null, string msg = null) : this(returnCode, status, msg)
        {
            this.Data = data;
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

        public static JsonResult Success(string status = StatusSuccess, string msg = StatusSuccess)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Success, Status = status, Msg = msg });
        }

        public static JsonResult Success(object data, string status = StatusSuccess, string msg = StatusSuccess)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Success, Status = status, Msg = msg, Data = data });
        }

        public static JsonResult Fail(string status = StatusFail, string msg = StatusFail)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Fail, Status = status, Msg = msg });
        }

        public static JsonResult Fail(object data, string status = StatusFail, string msg = StatusFail)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Fail, Status = status, Msg = msg, Data = data });
        }

        public static JsonResult Error(string status = StatusError, string msg = StatusError)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Error, Status = status, Msg = msg });
        }

        public static JsonResult Error(object data, string status = StatusError, string msg = StatusError)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.Error, Status = status, Msg = msg, Data = data });
        }

        public static JsonResult NotPermission(string status = StatusNotPermission, string msg = StatusNotPermission)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.NotPermission, Status = status, Msg = msg });
        }

        public static JsonResult NotFound(string status = StatusNotFound, string msg = StatusNotFound)
        {
            return new JsonResult(new ApiReturn() { Code = ReturnCode.NotFound, Status = status, Msg = msg });
        }

        #endregion
    }
}
