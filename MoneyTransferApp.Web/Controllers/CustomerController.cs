using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Common;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.PagingViewModels;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = RoleConstant.AllRoles)]
    public class CustomerController : BaseController
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        public IActionResult GetAllCustomer(PagingInputViewModel page)
        {
            return Ok(_customerService.GetAllCustomer(page));
        }
    }
}
