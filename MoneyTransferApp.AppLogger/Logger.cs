using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Core.DetectClientEnv;
using MoneyTransferApp.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace MoneyTransferApp.Logger
{
    public class Logger<TDbContext, TEntity> : ILogger
        where TDbContext : DbContext
        where TEntity : AppLog, new()
    {
        public const int MaxThreadLength = 255;
        public const int MaxLoggerLength = 255;
        public const int MaxLevelLength = 50;
        public const int MaxApplicationLength = 255;
        public const int MaxHostLength = 50;
        public const int MaxIpAddressLength = 50;
        public const int MaximumExceptionLength = 4000;
        public const int MaximumMessageLength = 8000;

        private readonly IServiceProvider _services;
        private readonly string _name;

        public Logger(string name, IServiceProvider serviceProvider)
        {
            _name = name;
            _services = serviceProvider;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
           
            try
            {
                if (!IsEnabled(logLevel))
                {
                    return;
                }

                // If level is debug, information or warning, stop here, do not go any further
                if (logLevel == LogLevel.Debug || logLevel == LogLevel.Information || logLevel == LogLevel.Warning)
                {
                    //TODO: Write log to log file here
                    return;
                }

                if (formatter == null)
                {
                    throw new ArgumentNullException(nameof(formatter));
                }

                var message = exception == null ?
                    formatter(state, exception) :
                    $"{formatter(state, exception)}{Environment.NewLine}{Environment.NewLine}{exception}";

                if (string.IsNullOrWhiteSpace(message))
                {
                    return;
                }

                HttpContext httpContext = null;
                string hostAddress = string.Empty;
                ClientBrowser browser = null;
                string userName = null;

                var httpContextAccessor = _services.GetRequiredService<IHttpContextAccessor>();
                if (httpContextAccessor != null)
                {
                    httpContext = httpContextAccessor.HttpContext;
                    if (httpContext != null)
                    {
                        hostAddress = httpContext.Request.Host.Value;
                        var userAgent = httpContext.Request.Headers["User-Agent"];
                        browser = userAgent == string.Empty ? null : new UserAgent(userAgent).Browser;
                        
                        // Get value of Authorization header
                        var authHeaders = httpContext.Request.Headers["Authorization"];

                        // Get the JWT token
                        var jwtToken = authHeaders[0].Split(' ')[1];

                        if (!string.IsNullOrWhiteSpace(jwtToken))
                        {
                            // Decrypt the token
                            var decrytedToken = new JwtSecurityToken(jwtToken);

                            // Return claims
                            var claims = decrytedToken.Claims.ToList();

                            var email = claims.FirstOrDefault(c => c.Type == "email")?.Value ?? string.Empty;
                            var companyNo = claims.FirstOrDefault(c => c.Type == "companyNo")?.Value ?? string.Empty;

                            //userName = $"Company: {companyNo}; Email: {email}";
                            userName = $"Company: {companyNo}";
                        }
                    }
                }

                var model = new TEntity
                {
                    Browser = browser == null ? "" : browser.Name + " " + browser.Version,
                    Username = userName,
                    Url = httpContext == null ? "" : httpContext.Request.Path.Value,
                    Date = DateTime.UtcNow,
                    Message = Trim(message, MaximumMessageLength),
                    Level = Trim($"{logLevel}", MaxLoggerLength),
                    Logger = Trim($"{_name}", MaxLoggerLength),
                    Thread = Trim($"{eventId}", MaxThreadLength),
                    HostAddress = Trim($"{hostAddress}", MaxHostLength)
                };

                switch (logLevel)
                {
                    case LogLevel.Critical:
                    case LogLevel.Error:
                        if (exception != null)
                        {
                            var exceptionPosition = GetExceptionPosition(exception);
                            model.ExceptionType = exception.GetType().Name;
                            model.Method = exceptionPosition.Method;
                            model.Row = exceptionPosition.Row;
                            model.Column = exceptionPosition.Column;
                            model.Exception = Trim($"{exception}", AppLog.MaximumExceptionLength);
                            // Save log to database:
                            // SaveLogToDB(model);
                            // Only send mail when there is an exception on production env:
                            //if (model.HostAddress.Contains("secure.complyto.com"))
                            //{
                                SendEmailReport(model);
                            //}
                        }
                        break;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private void SaveLogToDB(TEntity model)
        {
            try
            {
                var db = _services.GetRequiredService<TDbContext>();
                db.Set<AppLog>().Add(model);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                // ignored
            }
        }

        private void SendEmailReport(TEntity model, params object[] args)
        {
            var emailServices = _services.GetRequiredService<IEmailServices>();
            StringBuilder content = new StringBuilder();
            content.Append($"+ Host: {model.HostAddress} \n");
            content.Append($"+ Request: {model.Url} \n");
            content.Append($"+ Method: {model.Method} \n");
            content.Append($"+ User Info: {model.Username} \n");
            content.Append($"+ Error Message: {model.Message} \n");
            emailServices.SendExceptionError(content.ToString(), args);
        }

        private ExceptionPosition GetExceptionPosition(Exception exception)
        {
            int row = 0;
            int column = 0;
            string method = string.Empty;
            if (exception != null)
            {
                var st = new StackTrace(exception, true);
                // Get the top stack frame
                var frame = st.GetFrame(0);
                if (frame != null)
                {
                    // Get the line number from the stack frame
                    row = frame.GetFileLineNumber();
                    column = frame.GetFileColumnNumber();
                    method = frame.GetMethod().Name;
                }
            }

            return new ExceptionPosition() { Method = method, Row = row, Column = column };
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            if (state == null)
            {
                throw new ArgumentNullException(nameof(state));
            }

            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        private static string Trim(string value, int maximumLength)
        {
            return value.Length > maximumLength ? value.Substring(0, maximumLength) : value;
        }

        private class NoopDisposable : IDisposable
        {
            public void Dispose()
            {
            }
        }
    }

    internal class ExceptionPosition
    {
        internal string Method { get; set; }
        internal int Row { get; set; }
        internal int Column { get; set; }
    }
}
