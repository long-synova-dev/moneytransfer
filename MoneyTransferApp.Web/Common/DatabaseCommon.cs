using MoneyTransferApp.Core.Interfaces;
using System.Text;
using System.Linq;
using System;
using MoneyTransferApp.Core.Entities.Internal;
using System.Threading.Tasks;

namespace MoneyTransferApp.Web.Common
{
    public class DatabaseCommon
    {
        /// <summary>
        /// Generate the sql command help for get the translation data
        /// </summary>
        /// <param name="tableName">The table name which need to get translate text</param>
        /// <param name="columnNeedToTranslate">set of columns which is reference to the TranslationId</param>
        public static string GenerateSqlCommandForTranslation(IUnitOfWork unitOfWork, string schema, string tableName, string[] columns)
        {
            return GenerateSqlCommandForTranslation(unitOfWork, schema, tableName, columns, 0);
        }

        public static string GenerateSqlCommandForTranslation(IUnitOfWork unitOfWork, string schema, string tableName, string[] columns, int id)
        {
            StringBuilder sqlBuilder = new StringBuilder();
            var languages = unitOfWork.LanguageRepository.List().Result;
            for (int i = 0; i < languages.Count; i++)
            {
                if (i > 0)
                    sqlBuilder.Append(" UNION ");
                sqlBuilder.Append(" Select *, ");
                sqlBuilder.AppendFormat(" {0} as LanguageId, '{1}' as LanguageCode, '{2}' as LanguageName, ", languages[i].LanguageId, languages[i].LanguageCode, languages[i].LanguageName);
                for (int j = 0; j < columns.Length; j++)
                {
                    sqlBuilder.AppendFormat(" (Select TranslatedText from Internal.Translation where TranslationId = {0} and LanguageId = {1} ) as {2} ", columns[j], languages[i].LanguageId, columns[j].Replace("Id", "Text"));
                    if (j != columns.Length - 1)
                        sqlBuilder.Append(",");
                }
                sqlBuilder.AppendFormat(" From {0}.{1}", schema, tableName);
                if (id > 0)
                {
                    sqlBuilder.AppendFormat(" Where DeletedBy IS NULL and {0}{1} = {2}", tableName, "Id", id);
                }
            }

            return sqlBuilder.ToString();
        }

        /// <summary>
        /// Generate the sql command help for get the translation data
        /// </summary>
        /// <param name="tableName">The table name which need to get translate text</param>
        /// <param name="columnNeedToTranslate">set of columns which is reference to the TranslationId</param>
        public static string GenerateSqlCommandForTranslation(int languageId, string tableName, string[] columns)
        {
            StringBuilder sqlBuilder = new StringBuilder();
            
            sqlBuilder.Append(" Select *, ");
            sqlBuilder.AppendFormat(" {0} as LanguageId, ", languageId);
            for (int j = 0; j < columns.Length; j++)
            {
                sqlBuilder.AppendFormat(" (Select TranslatedText from Internal.Translation where TranslationId = {0} and LanguageId = {1} ) as {2} ", columns[j], languageId, columns[j].Replace("Id", "Text"));
                if (j != columns.Length - 1)
                    sqlBuilder.Append(",");
            }
            sqlBuilder.AppendFormat(" From {0}", tableName);
            sqlBuilder.Append(" Where DeletedBy IS NOT NULL ");


            return sqlBuilder.ToString();
        }

        /// <summary>
        /// Create new Translation
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="id"></param>
        /// <param name="languageId"></param>
        /// <param name="text"></param>
        /// <param name="userId"></param>
        public static void AddNewTranslation(IUnitOfWork unitOfWork, Guid id, int languageId, string text, Guid? userId)
        {
            Translation translation = new Translation()
            {
                TranslationId = id,
                LanguageId = languageId,
                TranslatedText = text,
                CreatedOn = DateTimeOffset.Now,
                CreatedBy = (Guid)userId
            };

            unitOfWork.TranslationRepository.Add(translation);
        }

        /// <summary>
        /// Update existing Translation
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="id"></param>
        /// <param name="languageId"></param>
        /// <param name="text"></param>
        /// <param name="userId"></param>
        public static void UpdateTranslation(IUnitOfWork unitOfWork, Guid id, int languageId, string text, Guid? userId)
        {
            var trans = unitOfWork.TranslationRepository.All().Where(s => s.TranslationId.Equals(id) && s.LanguageId.Equals(languageId)).FirstOrDefault();
            if (trans != null)
            {
                trans.TranslatedText = text;
                trans.UpdatedOn = DateTimeOffset.Now;
                trans.UpdatedBy = userId;
            }

            unitOfWork.SaveChange();
        }

        /// <summary>
        /// Delete all Translations with specific TranslationId
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="id"></param>
        public static void DeleteTranslation(IUnitOfWork unitOfWork, Guid id)
        {
            var trans = unitOfWork.TranslationRepository.All().Where(s => s.TranslationId.Equals(id));
            foreach (var tran in trans)
            {
                unitOfWork.TranslationRepository.Delete(tran);
            }
            unitOfWork.SaveChange();
        }

        /// <summary>
        /// Delete async all Translations base on specific TranslationId 
        /// </summary>
        /// <param name="unitOfWork"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task DeleteTranslationAsync(IUnitOfWork unitOfWork, Guid id)
        {
            var trans = unitOfWork.TranslationRepository.All().Where(s => s.TranslationId.Equals(id));
            foreach (var tran in trans)
            {
                unitOfWork.TranslationRepository.Delete(tran);
            }
            await unitOfWork.SaveChangeAsync();
        }
    }
}
