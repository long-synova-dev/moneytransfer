using System.IO;
using System.Net;
using System.Text;
using MoneyTransferApp.Auth;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Core.Settings;
using MoneyTransferApp.Infrastructure.Data;
using MoneyTransferApp.Infrastructure.Services;
using MoneyTransferApp.Web.Filters;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Net.Http.Headers;
using Microsoft.SqlServer.Management.AlwaysEncrypted.AzureKeyVaultProvider;
using MoneyTransferApp.Web.ExceptionHandlers;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Services;

//this is the startup class
namespace MoneyTransferApp.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment CurrentEnvironment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Set up database context
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.Configure<EmailSettings>(config => Configuration.GetSection("EmailSettings").Bind(config));
            services.Configure<ErrorEmailSettings>(config => Configuration.GetSection("ErrorEmailSettings").Bind(config));

            // Set up identity
            services.AddIdentity<User, Role>(config =>
            {
                config.SignIn.RequireConfirmedEmail = true;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
                config.Password.RequireLowercase = false;
                config.User.RequireUniqueEmail = false;
                config.Lockout.MaxFailedAccessAttempts = int.TryParse(Configuration["MaxFailedAccessAttempts"], out var maxFailed) ? maxFailed : 5;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Set up authentication
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                }).AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;

                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = Configuration["JwtTokens:Issuer"],
                        ValidAudience = Configuration["JwtTokens:Audience"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtTokens:Key"]))
                    };
                });
            // .AddCookie(cfg => cfg.SlidingExpiration = true);

            // Set up authorization and permission
            AuthSetup.ConfigureAuthorization(services);

            // Set up session
            services.AddDistributedMemoryCache();
            services.AddSession(options => options.IdleTimeout = TimeSpan.FromMinutes(30));

            // Add application services.
            ConfigureBusinessServices(services);

            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "ComplyTo Compliance Cloud Product API v1", Version = "v1" });
            });

            // Add custom antiforgery token for Angular
            services.AddAntiforgery(opts =>
            {
                opts.HeaderName = "X-XSRF-TOKEN";
                opts.SuppressXFrameOptionsHeader = true;
            });
            services.AddTransient<AntiforgeryCookieResultFilter>();

            // Add Mvc
            services.AddMvc();

            // Add httpcontext
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            if (CurrentEnvironment.IsProduction())
            {
                services.Configure<MvcOptions>(options =>
                {
                    options.Filters.Add(new RequireHttpsAttribute());
                });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
                app.UseDatabaseErrorPage();
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ComplyTo Compliance Cloud Product API v1");
                });
            }
            else
            {
                app.UseExceptionHandler("/LandingPages/Home/Error");

                //redirect to https
                //var options = new RewriteOptions().AddRedirectToHttps();
                //app.UseRewriter(options);
            }

            // Http Error Handler
            app.UseMyExceptionMiddleware();

            // It is important to place UseAuthentication method before Use method.
            app.UseAuthentication();

            // It is important to place Use method after UseAuthentication method.
            app.Use(async (context, next) =>
            {
                // Set antiforgery cookie for the response
                context.Response.Cookies.Append("XSRF-TOKEN", antiforgery.GetAndStoreTokens(context).RequestToken, new CookieOptions { HttpOnly = false, SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict });

                // Add recommended security headers for the responses
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
                context.Response.Headers.Add("Referrer-Policy", "no-referrer");
                context.Request.EnableRewind();

                await next();
                if (context.Response.StatusCode == (int)HttpStatusCode.NotFound &&
                    !Path.HasExtension(context.Request.Path.Value) &&
                    !context.Request.Path.Value.StartsWith("/api") &&
                    !context.Request.Path.Value.StartsWith("/landingpages"))
                {
                    context.Request.Path = context.Request.Path.Value.StartsWith("/sai") ? "/sai/index.html" : "/index.html";
                    await next();
                }
            });

            app.UseDefaultFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = (context) =>
                {
                    const int durationInSeconds = 60 * 60 * 24 * 30;
                    if (context.File.Name.ToLower().Contains(".css") || context.File.Name.ToLower().Contains(".png") || context.File.Name.ToLower().Contains(".jpg")
                        || context.File.Name.ToLower().Contains(".js") || context.File.Name.ToLower().Contains(".woff"))
                    {
                        context.Context.Response.Headers[HeaderNames.CacheControl] = "public, max-age=" + durationInSeconds;
                    }
                }
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles")),
                RequestPath = new PathString(String.Empty)
            });

            //Configure database encryption
            //InitializeAzureKeyVaultProvider(Configuration["Azure:AppRegistrationId"], Configuration["Azure:AppRegistrationKey"]);
            
            app.UseSession();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
            routes.MapRoute(
                name: "default",
                template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
            });
        }

        private static void ConfigureBusinessServices(IServiceCollection services)
        {
            services.AddTransient(typeof(IRepository<>), typeof(EfRepository<>));
            services.AddTransient<ISQLCommandExecutor, SQLCommandExecutor>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IEmailServices, EmailServices>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IUserService, UserService>();
        }

        private static ClientCredential _clientCredential;

        private static void InitializeAzureKeyVaultProvider(string appId, string appKey)
        {
            _clientCredential = new ClientCredential(appId, appKey);

            var azureKeyVaultProvider = new SqlColumnEncryptionAzureKeyVaultProvider(GetToken);

            var providers = new Dictionary<string, SqlColumnEncryptionKeyStoreProvider>
                {
                    {SqlColumnEncryptionAzureKeyVaultProvider.ProviderName, azureKeyVaultProvider}
                };

            SqlConnection.RegisterColumnEncryptionKeyStoreProviders(providers);
        }

        public static async Task<string> GetToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            var result = await authContext.AcquireTokenAsync(resource, _clientCredential);

            if (result == null)
            {
                throw new InvalidOperationException("Failed to obtain the access token");
            }

            return result.AccessToken;
        }
    }
}
