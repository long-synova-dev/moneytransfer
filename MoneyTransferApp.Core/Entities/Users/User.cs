using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Core.Entities.Gdpr;
using MoneyTransferApp.Core.Entities.Internal;
using Microsoft.AspNetCore.Identity;

namespace MoneyTransferApp.Core.Entities.Users
{
    public class User : IdentityUser<Guid>
    {
        [StringLength(50)]
        public string Title { get; set; }

        [StringLength(128)]
        public string FirstName { get; set; }

        [StringLength(128)]
        public string LastName { get; set; }

        public Guid? CompanyId { get; set; }

        public Guid? OrganizationalLevelId { get; set; }

        public int? LanguageId { get; set; }

        public bool? IsNeedChangePass { get; set; }

        public virtual Language Language { get; set; }

        public virtual Company Company { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }

        public ICollection<GdprTask> TaskPerformers { get; set; }

        public ICollection<GdprTask> TaskResponsibles { get; set; }

        public ICollection<GdprTask> TaskReviewers { get; set; }

        public ICollection<Risk> RiskOwners { get; set; }

        public ICollection<Risk> RiskResponsibles { get; set; }

        public ICollection<Policy> PolicyResponsibles { get; set; }

        public ICollection<DataProcessor> DataProcessorResponsibles { get; set; }

        public ICollection<DataProcessor> DataProcessorApprovers { get; set; }
        public ICollection<History> Histories { get; set; }
        public ICollection<ChangeLog> ChangeLogs { get; set; }

        public DateTimeOffset? LastLogin { get; set; }
    }
}
