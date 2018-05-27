using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Common;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    public class LanguageController : BaseController
    {
        [HttpGet("[action]")]
        [AllowAnonymous]
        public IActionResult All()
        {
            return Ok(Utils.GetAllLanguages());
        }
    }
}
