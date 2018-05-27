using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.CustomerViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;
using System.Threading.Tasks;

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
        public async Task<IActionResult> Save([FromBody] CustomerInfoViewModel customer)
        {
            var result = await _customerService.SaveCustomer(CurrentUserIdentity, customer);
            if (int.TryParse(result, out int id))
            {
                if (int.TryParse(result, out int receiverId))
                {
                    return Ok(new { Message = "Save.Success", CustomerId = id , ReceiverId = receiverId});
                }
                return Ok(new { Message = "Save.Success", CustomerId = id, ReceiverId = 0 });
            }

            return Ok(new { Message = result, CustomerId = -1, ReceiverId = 0 });
        }

        [HttpPost("[action]")]
        public IActionResult GetReceiverByCustomer([FromBody] int id)
        {
            var result = _customerService.GetReceiversByCustomer(id);
            return Ok(result);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetReceiverById(int id)
        {
            var result = _customerService.GetReceiverInfoById(id);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public IActionResult saveReceiver([FromBody] ReceiverInfoViewModel receiver)
        {
            var result = _customerService.SaveReceiver(CurrentUserIdentity, receiver);
            return Ok(new { Message = result });
        }
        
    }
}
