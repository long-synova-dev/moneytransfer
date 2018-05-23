using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyTransferApp.Core.Entities.Internal
{
    [Table("Language", Schema = "Internal")]
    public class Language
    {
        public int LanguageId { get; set; }

        [StringLength(50)]
        public string LanguageName { get; set; }

        [StringLength(10)]
        public string LanguageCode { get; set; }
    }
}
