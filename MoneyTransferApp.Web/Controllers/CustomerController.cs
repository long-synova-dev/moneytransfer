using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.CustomerViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    //[Authorize(Roles = RoleConstant.AllRoles)]
    public class CustomerController : BaseController
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("[action]")]
        public IActionResult GetAll(PagingInputViewModel page)
        {
            return Ok(_customerService.GetAllCustomer(page));
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetById(int id)
        {
            return Ok(_customerService.GetCustomerById(id));
        }

        [HttpPost("[action]")]
        public IActionResult Save([FromBody] CustomerInfoViewModel customer)
        {
            var result = _customerService.SaveCustomer(CurrentUserIdentity, customer);
            return Ok(new { Message = result });
        }
    }
}
