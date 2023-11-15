using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext :IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        //dotnet ef migrations add ActivityAttendee -p Persistence -s API migration komutu
        //dotnet ef database drop -p Persistence -s API "Drop database" bunun ardından seedleri tekrar yüklemek için "dotnet watch run" komutu yeterlidir.
        public  DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>(x=>x.HasKey(aa=>new {aa.AppUserId,aa.ActivityId}));

            builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.AppUser)
            .WithMany(a=>a.Activities)
            .HasForeignKey(aa=>aa.AppUserId);

              builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.Activity)
            .WithMany(a=>a.Attendees)
            .HasForeignKey(aa=>aa.ActivityId);

        }
    }
}