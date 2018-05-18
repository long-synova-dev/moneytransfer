using Microsoft.AspNetCore.Builder;

namespace MoneyTransferApp.Web.ExceptionHandlers
{
    public static class MyExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseMyExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MyExceptionMiddleware>();
        }
    }
}
