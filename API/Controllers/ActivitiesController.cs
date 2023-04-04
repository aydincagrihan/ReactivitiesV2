using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    // [ApiController]
    // [Route("[controller]")]
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            _context = context;

        }
        [HttpGet]
        public ActionResult<List<Activity>> GetActivities()
        {
            return _context.Activities.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>>GetActivity(Guid id)
        {
            return await _context.Activities.FindAsync(id);
        }
    }
}