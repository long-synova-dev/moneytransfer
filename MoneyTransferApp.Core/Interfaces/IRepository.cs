using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
namespace MoneyTransferApp.Core.Interfaces
{
    public interface IRepository<T>
    {
        Task<T> GetById(Guid id);
		IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
        Task<List<T>> List();
        T Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        IQueryable<T> All();
    }
}
