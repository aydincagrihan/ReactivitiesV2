using API.Controllers;
using Microsoft.AspNetCore.Mvc;

public class ProfilesController : BaseApiController
{
    [HttpGet("{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        return HandleResult(await Mediator.Send(new Application.Profiles.Details.Query { UserName = username }));
    }
}
