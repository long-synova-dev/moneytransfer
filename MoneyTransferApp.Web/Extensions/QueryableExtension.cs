using System.Linq;
using System.Linq.Expressions;

namespace MoneyTransferApp.Web.Extensions
{
    public static class QueryableExtensions
    {
        public static IOrderedQueryable<TSource> OrderByProperty<TSource>(this IQueryable<TSource> source, string propertyName, bool? isDesc)
        {
            var parameter = Expression.Parameter(typeof(TSource), "item");
            Expression property = Expression.Property(parameter, propertyName);
            var lambda = Expression.Lambda(property, parameter);

            var orderByMethod = typeof(Queryable).GetMethods().First(x => x.Name == (isDesc ?? false ? "OrderByDescending" : "OrderBy") && x.GetParameters().Length == 2);
            var orderByGeneric = orderByMethod.MakeGenericMethod(typeof(TSource), property.Type);
            var result = orderByGeneric.Invoke(null, new object[] { source, lambda });

            return (IOrderedQueryable<TSource>)result;
        }
    }
}
