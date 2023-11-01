using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Application;

namespace API.Controllers
{
    // [ApiController]
    // [Route("[controller]")]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            // return await Mediator.Send(new Application.Activities.List.Query());
            return HandleResult( await Mediator.Send(new Application.Activities.List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>GetActivity(Guid id)
        {
            // var result= await Mediator.Send(new Application.Activities.Details.Query{Id = id});

         return HandleResult(await Mediator.Send(new Application.Activities.Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return HandleResult(await Mediator.Send(new Application.Activities.Create.Command {Activity=activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id=id;
            return HandleResult(await Mediator.Send(new Application.Activities.Edit.Command { Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Application.Activities.Delete.Command {Id = id}));
        }
    }
}