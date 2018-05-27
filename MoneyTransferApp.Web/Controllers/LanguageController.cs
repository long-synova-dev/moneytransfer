using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Interfaces;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    public class LanguageController : BaseController
    {
        private readonly IUserService _userService;
        public LanguageController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public IActionResult All()
        {
            return Ok(_userService.GetAllLanguages());
        }
    }
}
