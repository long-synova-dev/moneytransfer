using System.Threading.Tasks;
using MoneyTransferApp.Core.Entities.Gdpr;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Core.Entities.Dbo;
using MoneyTransferApp.Core.Entities.Internal;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Entities.GRC;

namespace MoneyTransferApp.Core.Interfaces
{
    public interface IUnitOfWork
    {
		IRepository<UsersInfo> UsersInfoRepository { get; }
		IRepository<DoTest> DoTestRepository { get; }
		IRepository<AnonymousResults> AnonymousResultsRepository { get; }
		IRepository<Role> RoleRepository { get; }
		IRepository<RoleClaim> RoleClaimRepository { get; }
		IRepository<User> UserRepository { get; }
		IRepository<UserClaim> UserClaimRepository { get; }
		IRepository<UserLogin> UserLoginRepository { get; }
		IRepository<UserRole> UserRoleRepository { get; }
		IRepository<UserToken> UserTokenRepository { get; }
		IRepository<NotificationEvent> NotificationEventRepository { get; }
		IRepository<NotificationTemplate> NotificationTemplateRepository { get; }
        IRepository<Language> LanguageRepository { get; }
        IRepository<Translation> TranslationRepository { get; }
        IRepository<Company> CompanyRepository { get; }
		IRepository<CompanyDetail> CompanyDetailRepository { get; }
		IRepository<Subsidiary> SubsidiaryRepository { get; }
		IRepository<AppLog> AppLogRepository { get; }
        IRepository<BillingPlan> BillingPlanRepository { get; }
        IRepository<CompanySubscription> CompanySubscriptionRepository { get; }
		IRepository<ContactPoint> ContactPointRepository { get; }
        IRepository<TagTree> TagTreeRepository { get; }
		IRepository<GdprWizardStatus> GdprWizardStatusRepository { get; }
		IRepository<Question> QuestionaireRepository { get; }
		IRepository<Answer> AnswerRepository { get; }

		//Tags
		IRepository<Tag> TagRepository { get; }
		IRepository<TagCategory> TagCategoryRepository { get; }
		IRepository<TagType> TagTypeRepository { get; }
		IRepository<TagTypeTag> TagTypeTagRepository { get; }

        IRepository<Condition> ConditionRepository { get; }
        IRepository<Rule> RuleRepository { get; }
        IRepository<RuleChangeLog> RuleChangeLogRepository { get; }
        IRepository<TaskTemplate> TaskTemplateRepository { get; }
        IRepository<RiskTemplate> RiskTemplateRepository { get; }
		IRepository<ArticleTemplate> ArticleTemplateRepository { get; }
		IRepository<RiskTemplateArticleTemplate> RiskTemplateArticleTemplateRepository { get; }
		IRepository<RiskTemplateTaskTemplate> RiskTemplateTaskTemplateRepository { get; }

        IRepository<GdprTask> GdprTaskRepository { get; }
		IRepository<PolicyTemplate> PolicyTemplateRepository { get; }
		IRepository<PolicyChangeLog> PolicyChangeLogRepository { get; }
		IRepository<DataProcessorTemplate> DataProcessorTemplateRepository { get; }
		IRepository<DataProcessorChangeLog> DataProcessorChangeLogRepository { get; }
        IRepository<Process> ProcessRepository { get; }
        IRepository<Policy> PolicyRepository { get; }
        IRepository<DataProcessor> DataProcessorRepository { get; }
        IRepository<KeyValue> KeyValueRepository { get; }
		IRepository<FileUploaded> FileUploadedRepository { get; }
        IRepository<Counterpart> CounterpartRepository { get; }
        IRepository<Risk> RiskRepository { get; }
        IRepository<TodoTemplate> TodoTemplateRepository { get; }
        IRepository<Todo> TodoRepository { get; }
        IRepository<History> HistoryRepository { get; }
        IRepository<AddOn> AddOnRepository { get; }
        IRepository<GdprDocument> GdprDocumentRepository { get; }
        IRepository<ChangeLog> ChangeLogRepository { get; }
        IRepository<CompanyAddOn> CompanyAddOnRepository { get; }

        IRepository<Purpose> PurposeRepository { get; }
        IRepository<DeletionJustification> DeletionJustificationRepository { get; }
        IRepository<Vendor> VendorRepository { get; }
        IRepository<VendorTag> VendorTagRepository { get; }

        IRepository<OverviewPageSetting> OverviewPageSettingRepository { get; }
        IRepository<OverviewPageSettingRole> OverviewPageSettingRoleRepository { get; }

        void SaveChange();
		Task SaveChangeAsync();
    }
}
