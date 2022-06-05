using Coravel;
using SmartTraffic.Domain.Jobs;
using SmartTraffic.Domain.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
builder.Services.AddMvc();
builder.Services.AddScoped<TrafficLightService>();
builder.Services.AddScoped<TrafficDataService>();
builder.Services.AddScoped<MQTTService>();
builder.Services.AddScoped<CountGreenTimeJob>();
builder.Services.AddScheduler();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.Services.UseScheduler(scheduler =>
{
    scheduler.Schedule<CountGreenTimeJob>().EveryMinute();
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html"); ;
app.Run();
