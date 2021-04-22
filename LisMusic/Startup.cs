using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using LisMusic.Common;
using LisMusic.Services;

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

            services.AddControllersWithViews().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null; //属性命名策略。 null=保留属性名称不变
                options.JsonSerializerOptions.Converters.Add(new DateTimeToStringConverter());
                options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All); //编码
                options.JsonSerializerOptions.IgnoreNullValues = true;
            }).AddRazorRuntimeCompilation();

            //Http服务
            services.AddHttpClient<MusicHttpClient>();
            //各大音乐平台音乐服务
            //services.AddScoped<IALLMusicService, KGMusicService>(); //QQ和酷狗获取不到下载url，暂时屏蔽
            services.AddScoped<IALLMusicService, KWMusicService>();
            //services.AddScoped<IALLMusicService, QQMusicService>();
            services.AddScoped<IALLMusicService, WYYMusicService>();
            //总的音乐服务
            services.AddScoped<IMusicService, MusicService>();
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
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

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
