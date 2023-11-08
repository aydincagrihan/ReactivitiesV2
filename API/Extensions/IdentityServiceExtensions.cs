using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using Domain;
using Persistence;

namespace API.Extensions
{
    //Starup tarafını bölerek gidiyorum  identity ile ilgili servis işlemleri burda yapılıyor,burdanda Program cs içerisinde bu class çağırılıyor.
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;

            }).AddEntityFrameworkStores<DataContext>();
            services.AddAuthentication();
            services.AddScoped<TokenService>();
            return services;

        }


    }
}