using System;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Core.Entities.Dbo;
using MoneyTransferApp.Core.Entities.Gdpr;
using MoneyTransferApp.Core.Entities.Internal;
using MoneyTransferApp.Core.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using MoneyTransferApp.Core.Entities.GRC;

namespace MoneyTransferApp.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, Guid, UserClaim, UserRole, UserLogin, RoleClaim,
        UserToken>
    {
        public virtual DbSet<DoTest> DoTest { get; set; }
        public virtual DbSet<UsersInfo> UsersInfo { get; set; }
        public virtual DbSet<AnonymousResults> AnonymousResults { get; set; }

        public virtual DbSet<AppLog> AppLogs { get; set; }
        public virtual DbSet<NotificationTemplate> MessageTemplates { get; set; }
        public virtual DbSet<NotificationEvent> NotificationEvents { get; set; }
        public virtual DbSet<NotificationHistory> NotificationHistories { get; set; }
        public virtual DbSet<NotificationSetting> NotificationSettings { get; set; }

        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<CompanyDetail> CompanyDetails { get; set; }
        public virtual DbSet<Subsidiary> Subsidiaries { get; set; }
        public virtual DbSet<Translation> Translations { get; set; }
        public virtual DbSet<Language> Languages { get; set; }

        public virtual DbSet<TagCategory> TagCategories { get; set; }
        public virtual DbSet<TagType> TagTypes { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<TagTree> TagTrees { get; set; }
		public virtual DbSet<GdprWizardStatus> GdprWizardStatus { get; set; }
		public virtual DbSet<Question> Questionaires { get; set; }
		public virtual DbSet<Answer> Answers { get; set; }
		public virtual DbSet<TagTypeTag> TagTypeTags { get; set; }

        public virtual DbSet<Rule> Rules { get; set; }
        public virtual DbSet<RuleChangeLog> RuleChangeLogs { get; set; }
        public virtual DbSet<Condition> Conditions { get; set; }
        public virtual DbSet<TaskTemplate> TaskTemplates { get; set; }
        public virtual DbSet<RiskTemplate> RiskTemplates { get; set; }
        public virtual DbSet<RuleRiskTemplate> RuleRiskTemplates { get; set; }
        public virtual DbSet<RuleTaskTemplate> RuleTaskTemplates { get; set; }
		public virtual DbSet<RiskTemplateArticleTemplate> RiskTemplateArticleTemplates { get; set; }
		public virtual DbSet<RiskTemplateTaskTemplate> RiskTemplateTaskTemplates { get; set; }
        public virtual DbSet<TodoTemplate> TodoTemplates { get; set; }
		public virtual DbSet<PolicyTemplate> PolicyTemplates { get; set; }
		public virtual DbSet<PolicyChangeLog> PolicyChangeLogs { get; set; }
		public virtual DbSet<DataProcessorTemplate> DataProcessorTemplates { get; set; }
		public virtual DbSet<DataProcessorChangeLog> DataProcessorChangeLogs { get; set; }

		public virtual DbSet<GdprTask> Tasks { get; set; }
        public virtual DbSet<Todo> Todos { get; set; }
        public virtual DbSet<DataProcessor> DataProcessors { get; set; }
        public virtual DbSet<KeyValue> KeyValues { get; set; }
        public virtual DbSet<Policy> Policies { get; set; }
        public virtual DbSet<Process> Processes { get; set; }
        public virtual DbSet<Risk> Risks { get; set; }
        public virtual DbSet<Counterpart> Counterparts { get; set; }
        public virtual DbSet<CounterpartSubsidiary> CounterpartSubsidiaries { get; set; }
		public virtual DbSet<FileUploaded> FileUploadeds { get; set; }
        public virtual DbSet<History> Histories { get; set; }
        public virtual DbSet<ChangeLog> ChangeLogs { get; set; }

        public virtual DbSet<BillingPlan> BillingPlans { get; set; }
        public virtual DbSet<AddOn> AddOns { get; set; }
        public virtual DbSet<CompanyAddOn> CompanyAddOns { get; set; }

        public virtual DbSet<Purpose> Purposes { get; set; }
        public virtual DbSet<DeletionJustification> DeletionJustifications { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }
        public virtual DbSet<VendorTag> VendorTags { get; set; }

        public virtual DbSet<OverviewPageSetting> OverviewPageSettings { get; set; }
        public virtual DbSet<OverviewPageSettingRole> OverviewPageSettingRoles { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(entity =>
            {
                entity.ToTable("User", "User");
                entity.Property(e => e.Id).HasColumnName("UserId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(36);
                entity.Property(e => e.SecurityStamp).HasMaxLength(36);
                entity.Property(e => e.PasswordHash).HasMaxLength(256);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);

            });

            builder.Entity<Role>(entity =>
            {
                entity.ToTable("Role", "User");
                entity.Property(e => e.Id).HasColumnName("RoleId");
                entity.Property(e => e.ConcurrencyStamp).HasMaxLength(36);
            });

            builder.Entity<UserClaim>(entity =>
            {
                entity.ToTable("UserClaim", "User");
                entity.Property(e => e.UserId).HasColumnName("UserId");
                entity.Property(e => e.Id).HasColumnName("UserClaimId");
            });

            builder.Entity<UserLogin>(entity =>
            {
                entity.ToTable("UserLogin", "User");
            });

            builder.Entity<RoleClaim>(entity =>
            {
                entity.ToTable("RoleClaim", "User");
                entity.Property(e => e.Id).HasColumnName("RoleClaimId");
            });

            builder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRole", "User");
            });

            builder.Entity<UserToken>(entity =>
            {
                entity.ToTable("UserToken", "User");
            });

            builder.Entity<Translation>()
                .HasKey(c => new {c.TranslationId, c.LanguageId});

            builder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            builder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);


            builder.Entity<CompanyDetail>()
                .HasOne(i => i.CountryTag)
                .WithMany(u => u.CompanyDetailsCountry)
                .HasForeignKey(ur => ur.CountryTagId);

            builder.Entity<CompanyDetail>()
                .HasOne(i => i.CountryTag)
                .WithMany(u => u.CompanyDetailsCountry)
                .HasForeignKey(ur => ur.CountryTagId);

            builder.Entity<CompanyDetail>()
                .HasOne(i => i.IndustryTag)
                .WithMany(u => u.CompanyDetailsIndustry)
                .HasForeignKey(ur => ur.IndustryTagId);

            builder.Entity<CompanyDetail>()
                .HasOne(i => i.NumOfEmployeesTag)
                .WithMany(u => u.CompanyDetailsNumOfEmployees)
                .HasForeignKey(ur => ur.NumOfEmployeesTagId);

            builder.Entity<Subsidiary>()
                .HasOne(i => i.CountryTag)
                .WithMany(u => u.SubsidiariesCountry)
                .HasForeignKey(ur => ur.CountryTagId);

            builder.Entity<Condition>()
                .HasOne(con => con.ParentCondition)
                .WithMany(con => con.ChildrenConditions)
                .HasForeignKey(con => con.ParentConditionId);

            builder.Entity<RuleRiskTemplate>()
                .HasKey(rr => new {rr.RiskTemplateId, rr.RuleId});

            builder.Entity<RuleTaskTemplate>()
                .HasKey(rr => new { rr.TaskTemplateId, rr.RuleId });

			builder.Entity<TagTypeTag>()
				.HasKey(rr => new { rr.TagTypeId, rr.TagId });

			builder.Entity<RiskTemplateArticleTemplate>()
				.HasKey(rr => new { rr.RiskTemplateId, rr.ArticleTemplateId });

			builder.Entity<RiskTemplateTaskTemplate>()
				.HasKey(rr => new { rr.RiskTemplateId, rr.TaskTemplateId });

            builder.Entity<ArticleTemplate>()
                .HasOne(a => a.CountryTag)
                .WithMany(t => t.ArticleTemplatesCountry)
                .HasForeignKey(a => a.CountryTagId);

            builder.Entity<ArticleTemplate>()
                .HasOne(a => a.LegislationTag)
                .WithMany(t => t.ArticleTemplatesLegislation)
                .HasForeignKey(a => a.LegislationTagId);

            builder.Entity<GdprTask>()
                .HasOne(t => t.TaskPerformer)
                .WithMany(u => u.TaskPerformers)
                .HasForeignKey(t => t.TaskPerformerId);

            builder.Entity<GdprTask>()
                .HasOne(t => t.TaskResponsible)
                .WithMany(u => u.TaskResponsibles)
                .HasForeignKey(t => t.TaskResponsibleId);

            builder.Entity<GdprTask>()
                .HasOne(t => t.TaskReviewer)
                .WithMany(u => u.TaskReviewers)
                .HasForeignKey(t => t.TaskReviewerId);

            builder.Entity<Todo>()
                .HasOne(t => t.GdprTask)
                .WithMany(u => u.Todos)
                .HasForeignKey(t => t.TaskId);

            builder.Entity<Risk>()
                .HasOne(t => t.RiskOwner)
                .WithMany(u => u.RiskOwners)
                .HasForeignKey(t => t.RiskOwnerId);

            builder.Entity<Risk>()
                .HasOne(t => t.RiskResponsible)
                .WithMany(u => u.RiskResponsibles)
                .HasForeignKey(t => t.RiskResponsibleId);

            builder.Entity<Policy>()
                .HasOne(t => t.Responsible)
                .WithMany(u => u.PolicyResponsibles)
                .HasForeignKey(t => t.ResponsibleId);

            builder.Entity<DataProcessor>()
                .HasOne(t => t.Approver)
                .WithMany(u => u.DataProcessorApprovers)
                .HasForeignKey(t => t.ApprovedBy);

            builder.Entity<History>()
                .HasOne(t => t.User)
                .WithMany(u =>u.Histories)
                .HasForeignKey(t => t.UserId);

            builder.Entity<ChangeLog>()
                .HasOne(t => t.User)
                .WithMany(u => u.ChangeLogs)
                .HasForeignKey(t => t.UserId);

            builder.Entity<OverviewPageSettingRole>()
                .HasKey(rr => new { rr.OverviewPageSettingId, rr.RoleId });

            builder.Entity<VendorTag>().
                HasKey(s => new { s.TagId, s.VendorId });

            builder.Entity<VendorTag>()
                .HasOne(t => t.Vendor)
                .WithMany(t => t.VendorTags)
                .HasForeignKey(t => t.VendorId);

            builder.Entity<VendorTag>()
                .HasOne(t => t.Tag)
                .WithMany(t => t.VendorTags)
                .HasForeignKey(t => t.TagId);
        }
    }
}