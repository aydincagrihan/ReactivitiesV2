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
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new Application.Activities.List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>>GetActivity(Guid id)
        {
            return await Mediator.Send(new Application.Activities.Details.Query{Id = id});
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return Ok(await Mediator.Send(new Application.Activities.Create.Command {Activity=activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id=id;
            return Ok(await Mediator.Send(new Application.Activities.Edit.Command { Activity = activity}));
        }
    }
}