using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.TransactionViewModels;
using System.Threading.Tasks;
using System.Linq;
using MoneyTransferApp.Core.Entities.Client;
using System;
using MoneyTransferApp.Web.Models.PagingViewModels;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Web.Common;

namespace MoneyTransferApp.Web.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public TransactionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public PagingOutputViewModel<TransactionListViewModel> SearchTransaction(TransactionFilterViewModel filter)
        {
            var output = new PagingOutputViewModel<TransactionListViewModel>
            {
                ItemsPerPage = 15
            };

            var repository = _unitOfWork.TransactionRepository.All().Include(s => s.Receiver).ThenInclude(s => s.Customer);
            if (!string.IsNullOrEmpty(filter.CustomerNo))
            {
                repository.Where(s => s.Receiver.Customer.CustomerCode == filter.CustomerNo);
            }

            if (!string.IsNullOrEmpty(filter.CustomerPhone))
            {
                repository.Where(s => s.Receiver.Customer.Phone == filter.CustomerPhone);
            }

            if (!string.IsNullOrEmpty(filter.TransactionNo))
            {
                repository.Where(s => s.TransactionNo == filter.TransactionNo);
            }

            if (!string.IsNullOrEmpty(filter.CreateDateStart.ToString()))
            {
                repository.Where(s => DateTimeOffset.Compare(s.CreatedOn.Value, filter.CreateDateStart.Value) >= 0);
            }

            if (!string.IsNullOrEmpty(filter.CreateDateEnd.ToString()))
            {
                repository.Where(s => DateTimeOffset.Compare(s.CreatedOn.Value, filter.CreateDateEnd.Value) <= 0);
            }
            
            var data = repository.Select(trans => new TransactionListViewModel
            {
                TransactionId = trans.TransactionId,
                TransactionNo = trans.TransactionNo,
                CustomerCode = trans.Receiver.Customer.CustomerCode,
                CustomerName = trans.Receiver.Customer.FullName,
                ReceiverName = trans.Receiver.ReceiverName,
                CurrencyName = ((Currency)trans.CurrencyId).ToString(),
                Amount = trans.Amount,
                CreatedOn = trans.CreatedOn
            });
            

            data = data.Take(output.ItemsPerPage);

            // Enumerate the data
            output.TotalItems = repository.Count();
            output.Data = data.ToList();

            return output;
        }

        public async Task<string> SaveTransaction(UserIdentityViewModel user, TransactionDetailViewModel model)
        {
            if (string.IsNullOrEmpty(model.TransactionNo))
            {
                return await CreateTransaction(user, model);
            }
            else
            {
                return await UpdateTransaction(user, model);
            }
        }

        #region Private Method

        private async Task<string> CreateTransaction(UserIdentityViewModel user, TransactionDetailViewModel model)
        {
            try
            {
                var transaction = new Transaction
                {
                    TransactionNo = GenerateTransactionNo(model.CustomerId),
                    ReceiverId = model.ReceiverId,
                    CurrencyId = model.CurrencyId,
                    Amount = model.Amount,
                    Status = (int)Status.New,
                    CreatedOn = DateTimeOffset.Now,
                    CreatedBy = user.UserId
                };
                _unitOfWork.TransactionRepository.Add(transaction);
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception e)
            {
                return "Transaction.SaveError";
            }
            return "Transaction.SaveSuccess";
        }

        private async Task<string> UpdateTransaction(UserIdentityViewModel user, TransactionDetailViewModel model)
        {
            try
            {
                var transaction = _unitOfWork.TransactionRepository.All().FirstOrDefault(s => s.TransactionId == model.TransactionId);
                if (transaction == null)
                {
                    return "Transaction.NotExist";
                }
                transaction.ReceiverId = model.ReceiverId;
                transaction.CurrencyId = model.CurrencyId;
                transaction.Amount = model.Amount;
                transaction.UpdatedOn = DateTimeOffset.Now;
                transaction.UpdatedBy = user.UserId;

                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                return "Transaction.SaveError";
            }
            return "Transaction.SaveSuccess";
        }

        private string GenerateTransactionNo(int customerId)
        {
            var customer = _unitOfWork.CustomerRepository.All().Where(s => s.CustomerId == customerId);
            var customerNo = customer.FirstOrDefault().CustomerCode;
            var count = customer.Count();

            return $"{customerNo}-{count + 1}";
        }

        #endregion
    }
}
