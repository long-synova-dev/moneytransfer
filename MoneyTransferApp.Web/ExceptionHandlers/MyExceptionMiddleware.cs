using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MoneyTransferApp.Web.ExceptionHandlers
{
    public class MyExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<MyExceptionMiddleware> _logger;

        public MyExceptionMiddleware(RequestDelegate next, ILogger<MyExceptionMiddleware> logger)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (context.Response.HasStarted)
                {
                    _logger.LogWarning("The response has already started, the http status code middleware will not be executed.");
                    throw;
                }

                int code;

                // Log the error
                EventId eventId = new EventId();
                _logger.LogError(eventId.Id, ex, ex.Message);

                // Convert known exceptions to status codes
                switch (ex)
                {
                    case ArgumentNullException _:
                        code = StatusCodes.Status404NotFound;
                        break;
                    case DbUpdateException _:
                        code = StatusCodes.Status500InternalServerError;
                        break;
                    // ....... More known exceptions here
                    default:
                        code = StatusCodes.Status500InternalServerError;
                        break;
                }

                // Write the response
                context.Response.Clear();
                context.Response.StatusCode = code;
                context.Response.ContentType = @"application/json";

                await context.Response.WriteAsync(ex.Message);
            }
        }
    }
}
