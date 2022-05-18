using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using LisMusic.Common;
using LisMusic.Services;
using System.Text.Json;
using Microsoft.Extensions.WebEncoders;
using LisMusic.Services.MusicHandler;

namespace LisMusic
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSession();
            services.AddResponseCaching();

            services.Configure<WebEncoderOptions>(options => options.TextEncoderSettings = new TextEncoderSettings(UnicodeRanges.All));
            services.Configure<JsonSerializerOptions>(options =>
            {
                //options.JsonSerializerOptions.PropertyNamingPolicy = null; // �����������ԡ� null=�����������Ʋ���
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.Converters.Add(new DateTimeToStringConverter());
                options.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All); // ����
                options.IgnoreNullValues = true;
            });

            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                //options.JsonSerializerOptions.PropertyNamingPolicy = null; // �����������ԡ� null=�����������Ʋ���
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.Converters.Add(new DateTimeToStringConverter());
                options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All); // ����
                options.JsonSerializerOptions.IgnoreNullValues = true;
            }).AddRazorRuntimeCompilation();

            // Http ��������
            services.AddHttpClient<MusicHttpClient>();

            // ��������ƽ̨�����ṩ����
            //services.AddScoped<IMusicHandler, KGMusicHandler>();
            services.AddScoped<IMusicHandler, KWMusicHandler>();
            //services.AddScoped<IMusicHandler, QQMusicHandler>();
            //services.AddScoped<IMusicHandler, WYYMusicHandler>();
            services.AddScoped<IMusicHandlerProvider, MusicHandlerProvider>();

            // ���ַ���
            services.AddScoped<IMusicService, MusicService>();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowCors", builder =>
                {
                    builder.WithOrigins(_configuration["URL:Domain"])
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });
        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseResponseCaching();
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("AllowCors");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Player}/{action=Index}/{id?}");
            });
        }
    }
}
