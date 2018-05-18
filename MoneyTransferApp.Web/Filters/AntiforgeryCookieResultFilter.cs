using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MoneyTransferApp.Web.Filters
{
    public class AntiforgeryCookieResultFilter : ResultFilterAttribute
    {
        private readonly IAntiforgery _antiforgery;

        public AntiforgeryCookieResultFilter(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (!(context.Result is ViewResult))
            {
                return;
            }

            var tokens = _antiforgery.GetAndStoreTokens(context.HttpContext);
            context.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions
            {
                HttpOnly = false
            });
        }
    }
}
