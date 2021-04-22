using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Common
{
    public class ExceptionLogFilter : IAsyncExceptionFilter, IExceptionFilter
    {

        public void OnException(ExceptionContext context)
        {
            throw new NotImplementedException();
        }

        public Task OnExceptionAsync(ExceptionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
