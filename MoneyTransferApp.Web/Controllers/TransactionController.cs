using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MoneyTransferApp.Web.Controllers
{
    public class TransactionController : BaseController
    {
        public IActionResult GetAll()
        {
            return View();
        }
    }
}
