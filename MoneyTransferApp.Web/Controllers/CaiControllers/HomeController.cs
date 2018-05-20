using MoneyTransferApp.Auth.Policies;
using MoneyTransferApp.Web.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MoneyTransferApp.Web.Controllers.CaiControllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = RoleConstant.AllRoles, Policy = PolicyNames.AllPlansPolicy)]
    public class HomeController : BaseController
    {
        [HttpGet("[action]")]
        public IActionResult Ping()
        {
            return Ok(new { Message = "You can only see this message from the server if you are authenticated AND you have subscribed to a billing plan." });
        }
    }
}
