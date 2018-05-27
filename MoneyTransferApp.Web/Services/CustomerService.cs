using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.CustomerViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Extensions;
using System.Linq;
using System.Threading.Tasks;
using MoneyTransferApp.Core.Entities.Client;
using System;
using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.CommonViewModels;
using System.Collections.Generic;

namespace MoneyTransferApp.Web.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CustomerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public PagingOutputViewModel<CustomerInfoViewModel> GetAllCustomer(PagingInputViewModel param)
        {
            var output = new PagingOutputViewModel<CustomerInfoViewModel>
            {
                ItemsPerPage = param.ItemsPerPage
            };

            var repository = _unitOfWork.CustomerRepository.All();
            if (!string.IsNullOrEmpty(param.Keyword))
            {
                repository = repository
                    .Where(cus => cus.FullName.Contains(param.Keyword)
                                    || cus.CustomerCode.Contains(param.Keyword)
                                   || cus.Phone.Contains(param.Keyword));
            }

            var data = repository.Select(customer => new CustomerInfoViewModel
            {
                CustomerId = customer.CustomerId,
                FullName = customer.FullName,
                CustomerCode = customer.CustomerCode,
                Email = customer.Email,
                PhoneNumber = customer.Phone,
                Address = customer.Address,
                SelectedReceiverId = customer.SelectedReceiverId
            });

            if (!string.IsNullOrEmpty(param.OrderBy))
            {
                data = data.OrderByProperty(param.OrderBy, param.IsDesc);
            }

            data = data.Skip((param.PageNumber - 1) * param.ItemsPerPage).Take(param.ItemsPerPage);

            // Enumerate the data
            output.TotalItems = repository.Count();
            output.Data = data.ToList();

            return output;
        }

        public CustomerInfoViewModel GetCustomerById(int id)
        {
            var customer = _unitOfWork.CustomerRepository.All().FirstOrDefault(s => s.CustomerId == id);
            if (customer == null) return null;
            return new CustomerInfoViewModel
            {
                CustomerId = customer.CustomerId,
                FullName = customer.FullName,
                CustomerCode = customer.CustomerCode,
                PhoneNumber = customer.Phone,
                Address = customer.Address,
                Email = customer.Email,
                SelectedReceiverId = customer.SelectedReceiverId
            };
        }

        public async Task<string> SaveCustomer(UserIdentityViewModel user, CustomerInfoViewModel model)
        {
            string result = string.Empty;
            if(model.CustomerId == 0)
            {
                result = await CreateCustomer(user, model);
            }
            else
            {
                result = await UpdateCustomer(user, model);
            }
            return result;
        }

        public async Task<string> DeleteCustomer(UserIdentityViewModel user, int id)
        {
            string result = string.Empty;

            var customer = _unitOfWork.CustomerRepository.All().FirstOrDefault(s => s.CustomerId == id);
            if (customer == null)
                return "Customer.NotExist";
            result = await DeleteReceiver(user, id);

            return result;
        }

        public ICollection<OptionViewModel> GetReceiversByCustomer(int customerId)
        {
            var receivers = _unitOfWork.ReceiverRepository.All().Where(s => s.CustomerId == customerId).Select(s => new OptionViewModel
            {
                Value = s.ReceiverId.ToString(),
                Label = s.ReceiverName + " " + s.ReceiverPhone1
            });

            return receivers.ToList();
        }

        public ReceiverInfoViewModel GetReceiverInfoById(int id)
        {
            return _unitOfWork.ReceiverRepository.All().Select(s => new ReceiverInfoViewModel
            {
                CustomerId = s.CustomerId,
                ReceiverId = s.ReceiverId,
                ReceiverName = s.ReceiverName,
                ReceiverIdentityCard = s.ReceiverIdentityCard,
                IDIssueDate = s.IDIssueDate,
                ReceiverPhone1 = s.ReceiverPhone1,
                ReceiverPhone2 = s.ReceiverPhone2,
                BankName = s.BankName,
                BankAccount = s.BankAccount,
                BranchName = s.BranchName,
                District = s.District,
                Province = s.Province
            }).FirstOrDefault(s => s.ReceiverId == id);
        }

        public async Task<string> SaveReceiver(UserIdentityViewModel user, ReceiverInfoViewModel model)
        {
            string result = string.Empty;
            if (model.ReceiverId > 0)
            {
                result = await CreateReceiver(user, model);
            }
            else
            {
                result = await UpdateReceiver(user, model);
            }
            return result;
        }

        public async Task<string> DeleteReceiver(UserIdentityViewModel user, int id)
        {
            var receiver = _unitOfWork.ReceiverRepository.All().FirstOrDefault(s => s.ReceiverId == id);
            if (receiver == null)
                return "Receiver.NotExist";
            _unitOfWork.ReceiverRepository.Delete(receiver);
            await _unitOfWork.SaveChangeAsync();

            return "Delete.Success";
        }


        #region Private Method

        private async Task<string> CreateCustomer(UserIdentityViewModel user, CustomerInfoViewModel model)
        {
            try
            {
                var customer = new Customer
                {
                    FullName = model.FullName,
                    CustomerCode = model.CustomerCode,
                    Email = model.Email,
                    Address = model.Address,
                    Phone = model.PhoneNumber,
                    SelectedReceiverId = model.SelectedReceiverId,
                    CreatedOn = DateTimeOffset.Now,
                    CreatedBy = user?.UserId
                };
                _unitOfWork.CustomerRepository.Add(customer);
                await _unitOfWork.SaveChangeAsync();

                return customer.CustomerId.ToString();
            }
            catch (Exception ex)
            {
                return "Save.Error";
            }
        }

        private async Task<string> UpdateCustomer(UserIdentityViewModel user, CustomerInfoViewModel model)
        {
            try
            {
                var customer = _unitOfWork.CustomerRepository.All().FirstOrDefault(s => s.CustomerId == model.CustomerId);
                customer.CustomerCode = model.CustomerCode;
                customer.FullName = model.FullName;
                customer.Email = model.Email;
                customer.Address = model.Address;
                customer.Phone = model.PhoneNumber;
                customer.SelectedReceiverId = model.SelectedReceiverId;
                customer.UpdatedBy = user.UserId;
                customer.UpdatedOn = DateTimeOffset.Now;
                await _unitOfWork.SaveChangeAsync();

                return customer.CustomerId.ToString();
            }
            catch(Exception)
            {
                return "Save.Error";
            }
        }

        private async Task<string> CreateReceiver(UserIdentityViewModel user, ReceiverInfoViewModel model)
        {
            try
            {
                var receiver = new Receiver
                {
                    CustomerId = model.CustomerId,
                    ReceiverName = model.ReceiverName,
                    ReceiverIdentityCard = model.ReceiverIdentityCard,
                    IDIssueDate = model.IDIssueDate,
                    ReceiverPhone1 = model.ReceiverPhone1,
                    ReceiverPhone2 = model.ReceiverPhone2,
                    BankName = model.BankName,
                    BankAccount = model.BankAccount,
                    BranchName = model.BranchName,
                    Province = model.Province,
                    District = model.District,
                    CreatedOn = DateTimeOffset.Now,
                    CreatedBy = user.UserId
                };
                _unitOfWork.ReceiverRepository.Add(receiver);
                await _unitOfWork.SaveChangeAsync();

                return "Save.Success";
            }
            catch (Exception)
            {
                return "Save.Error";
            }
        }

        private async Task<string> UpdateReceiver(UserIdentityViewModel user, ReceiverInfoViewModel model)
        {
            try
            {
                var customer = _unitOfWork.ReceiverRepository.All().FirstOrDefault(s => s.ReceiverId == model.ReceiverId);
                customer.ReceiverName = model.ReceiverName;
                customer.ReceiverIdentityCard = model.ReceiverIdentityCard;
                customer.IDIssueDate = model.IDIssueDate;
                customer.ReceiverPhone1 = model.ReceiverPhone1;
                customer.ReceiverPhone2 = model.ReceiverPhone2;
                customer.BankName = model.BankName;
                customer.BankAccount = model.BankAccount;
                customer.BranchName = model.BranchName;
                customer.Province = model.Province;
                customer.District = model.District;
                customer.UpdatedBy = user.UserId;
                customer.UpdatedOn = DateTimeOffset.Now;
                await _unitOfWork.SaveChangeAsync();

                return "Save.Success";
            }
            catch (Exception)
            {
                return "Save.Error";
            }
        }

        #endregion
    }
}
