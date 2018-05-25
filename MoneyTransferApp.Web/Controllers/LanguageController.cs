using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Models.CommonViewModels;
using Newtonsoft.Json;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    public class LanguageController : BaseController
    {
        [HttpGet("[action]")]
        [AllowAnonymous]
        public IActionResult All()
        {
            using (StreamReader r = new StreamReader("language.json"))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<List<LanguageViewModel>>(json);
                return Ok(items);
            }

        }
    }
}
