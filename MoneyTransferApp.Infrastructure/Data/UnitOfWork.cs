using System.Threading.Tasks;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Core.Entities.Dbo;
using MoneyTransferApp.Core.Entities.Gdpr;
using MoneyTransferApp.Core.Entities.Internal;
using MoneyTransferApp.Core.Entities.Users;
using NotificationEvent = MoneyTransferApp.Core.Entities.Internal.NotificationEvent;
using MoneyTransferApp.Core.Entities.GRC;

namespace MoneyTransferApp.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _dbContext;
        public UnitOfWork(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IRepository<UsersInfo> _usersInfoRepository;
        public IRepository<UsersInfo> UsersInfoRepository
        {
            get
            {
                return _usersInfoRepository = _usersInfoRepository ?? new EfRepository<UsersInfo>(_dbContext);
            }
        }

        private IRepository<DoTest> _doTestRepository;
        public IRepository<DoTest> DoTestRepository
        {
            get
            {
                return _doTestRepository = _doTestRepository ?? new EfRepository<DoTest>(_dbContext);
            }
        }

        private IRepository<AnonymousResults> _anonymousResultsRepository;
        public IRepository<AnonymousResults> AnonymousResultsRepository
        {
            get
            {
                return _anonymousResultsRepository = _anonymousResultsRepository ?? new EfRepository<AnonymousResults>(_dbContext);
            }
        }

        private IRepository<Role> _roleRepository;
        public IRepository<Role> RoleRepository
        {
            get
            {
                return _roleRepository = _roleRepository ?? new EfRepository<Role>(_dbContext);
            }
        }

        private IRepository<RoleClaim> _roleClaimRepository;
        public IRepository<RoleClaim> RoleClaimRepository
        {
            get
            {
                return _roleClaimRepository = _roleClaimRepository ?? new EfRepository<RoleClaim>(_dbContext);
            }
        }

        private IRepository<UserClaim> _userClaimRepository;
        public IRepository<UserClaim> UserClaimRepository
        {
            get
            {
                return _userClaimRepository = _userClaimRepository ?? new EfRepository<UserClaim>(_dbContext);
            }
        }

        private IRepository<UserRole> _userRoleRepository;
        public IRepository<UserRole> UserRoleRepository
        {
            get
            {
                return _userRoleRepository = _userRoleRepository ?? new EfRepository<UserRole>(_dbContext);
            }
        }

        private IRepository<UserToken> _userTokenRepository;
        public IRepository<UserToken> UserTokenRepository
        {
            get
            {
                return _userTokenRepository = _userTokenRepository ?? new EfRepository<UserToken>(_dbContext);
            }
        }

        private IRepository<UserLogin> _userLoginRepository;
        public IRepository<UserLogin> UserLoginRepository
        {
            get
            {
                return _userLoginRepository = _userLoginRepository ?? new EfRepository<UserLogin>(_dbContext);
            }
        }

        private IRepository<User> _userRepository;
        public IRepository<User> UserRepository
        {
            get
            {
                return _userRepository = _userRepository ?? new EfRepository<User>(_dbContext);
            }
        }

        private IRepository<NotificationEvent> _notificationEventRepository;
        public IRepository<NotificationEvent> NotificationEventRepository
        {
            get
            {
                return _notificationEventRepository = _notificationEventRepository ?? new EfRepository<NotificationEvent>(_dbContext);
            }
        }

        private IRepository<NotificationTemplate> _notificationTemplateRepository;
        public IRepository<NotificationTemplate> NotificationTemplateRepository
        {
            get
            {
                return _notificationTemplateRepository = _notificationTemplateRepository ?? new EfRepository<NotificationTemplate>(_dbContext);
            }
        }

        private IRepository<Language> _languageRepository;
        public IRepository<Language> LanguageRepository
        {
            get
            {
                return _languageRepository = _languageRepository ?? new EfRepository<Language>(_dbContext);
            }
        }

        private IRepository<Translation> _translationRepository;
        public IRepository<Translation> TranslationRepository
        {
            get
            {
                return _translationRepository = _translationRepository ?? new EfRepository<Translation>(_dbContext);
            }
        }

        private IRepository<Company> _companyRepository;
        public IRepository<Company> CompanyRepository
        {
            get
            {
                return _companyRepository = _companyRepository ?? new EfRepository<Company>(_dbContext);
            }
        }

        private IRepository<CompanyDetail> _companyDetailRepository;
        public IRepository<CompanyDetail> CompanyDetailRepository
        {
            get
            {
                return _companyDetailRepository = _companyDetailRepository ?? new EfRepository<CompanyDetail>(_dbContext);
            }
        }

        private IRepository<Subsidiary> _subsidiaryRepositoty;
        public IRepository<Subsidiary> SubsidiaryRepository
        {
            get
            {
                return _subsidiaryRepositoty = _subsidiaryRepositoty ?? new EfRepository<Subsidiary>(_dbContext);
            }
        }

        private IRepository<AppLog> _appLogRepository;
        public IRepository<AppLog> AppLogRepository
        {
            get
            {
                return _appLogRepository = _appLogRepository ?? new EfRepository<AppLog>(_dbContext);
            }
        }

        private IRepository<BillingPlan> _billingPlanRepository;
        public IRepository<BillingPlan> BillingPlanRepository
        {
            get
            {
                return _billingPlanRepository = _billingPlanRepository ?? new EfRepository<BillingPlan>(_dbContext);
            }
        }

        private IRepository<CompanySubscription> _companySubscriptionRepository;
        public IRepository<CompanySubscription> CompanySubscriptionRepository
        {
            get
            {
                return _companySubscriptionRepository = _companySubscriptionRepository ?? new EfRepository<CompanySubscription>(_dbContext);
            }
        }

        private IRepository<ContactPoint> _contactPointRepository;
        public IRepository<ContactPoint> ContactPointRepository
        {
            get
            {
                return _contactPointRepository = _contactPointRepository ?? new EfRepository<ContactPoint>(_dbContext);
            }
        }

        #region Tags

        private IRepository<Tag> _tagRepository;
        public IRepository<Tag> TagRepository
        {
            get
            {
                return _tagRepository = _tagRepository ?? new EfRepository<Tag>(_dbContext);
            }
        }

        private IRepository<TagCategory> _tagCategoryRepository;
        public IRepository<TagCategory> TagCategoryRepository
        {
            get
            {
                return _tagCategoryRepository = _tagCategoryRepository ?? new EfRepository<TagCategory>(_dbContext);
            }
        }

        private IRepository<TagType> _tagTypeRepository;
        public IRepository<TagType> TagTypeRepository
        {
            get
            {
                return _tagTypeRepository = _tagTypeRepository ?? new EfRepository<TagType>(_dbContext);
            }
        }

        private IRepository<TagTypeTag> _tagTypeTagRepository;
        public IRepository<TagTypeTag> TagTypeTagRepository
        {
            get
            {
                return _tagTypeTagRepository = _tagTypeTagRepository ?? new EfRepository<TagTypeTag>(_dbContext);
            }
        }

        #endregion

        private IRepository<TagTree> _tagTreeRepository;
        public IRepository<TagTree> TagTreeRepository
        {
            get
            {
                return _tagTreeRepository = _tagTreeRepository ?? new EfRepository<TagTree>(_dbContext);
            }
        }

        private IRepository<GdprWizardStatus> _gdprWizardStatusRepository;
        public IRepository<GdprWizardStatus> GdprWizardStatusRepository
        {
            get
            {
                return _gdprWizardStatusRepository = _gdprWizardStatusRepository ?? new EfRepository<GdprWizardStatus>(_dbContext);
            }
        }


        private IRepository<Condition> _conditionRepository;
        public IRepository<Condition> ConditionRepository
        {
            get
            {
                return _conditionRepository = _conditionRepository ?? new EfRepository<Condition>(_dbContext);
            }
        }


        private IRepository<Rule> _ruleRepository;
        public IRepository<Rule> RuleRepository
        {
            get
            {
                return _ruleRepository = _ruleRepository ?? new EfRepository<Rule>(_dbContext);
            }
        }

        private IRepository<RuleChangeLog> _ruleChangeLogRepository;
        public IRepository<RuleChangeLog> RuleChangeLogRepository
        {
            get
            {
                return _ruleChangeLogRepository = _ruleChangeLogRepository ?? new EfRepository<RuleChangeLog>(_dbContext);
            }
        }

        private IRepository<TaskTemplate> _taskTemplateRepository;
        public IRepository<TaskTemplate> TaskTemplateRepository
        {
            get
            {
                return _taskTemplateRepository = _taskTemplateRepository ?? new EfRepository<TaskTemplate>(_dbContext);
            }
        }

        private IRepository<RiskTemplate> _riskTemplateRepository;
        public IRepository<RiskTemplate> RiskTemplateRepository
        {
            get
            {
                return _riskTemplateRepository = _riskTemplateRepository ?? new EfRepository<RiskTemplate>(_dbContext);
            }
        }

        private IRepository<ArticleTemplate> _articleTemplateRepository;
        public IRepository<ArticleTemplate> ArticleTemplateRepository
        {
            get
            {
                return _articleTemplateRepository = _articleTemplateRepository ?? new EfRepository<ArticleTemplate>(_dbContext);
            }
        }

        private IRepository<RiskTemplateArticleTemplate> _riskArticleRepository;
        public IRepository<RiskTemplateArticleTemplate> RiskTemplateArticleTemplateRepository
        {
            get
            {
                return _riskArticleRepository = _riskArticleRepository ?? new EfRepository<RiskTemplateArticleTemplate>(_dbContext);
            }
        }

        private IRepository<RiskTemplateTaskTemplate> _riskTaskRepository;
        public IRepository<RiskTemplateTaskTemplate> RiskTemplateTaskTemplateRepository
        {
            get
            {
                return _riskTaskRepository = _riskTaskRepository ?? new EfRepository<RiskTemplateTaskTemplate>(_dbContext);
            }
        }

        private IRepository<Question> _questionaireRepository;
        public IRepository<Question> QuestionaireRepository
        {
            get
            {
                return _questionaireRepository = _questionaireRepository ?? new EfRepository<Question>(_dbContext);
            }
        }

        private IRepository<Answer> _answerRepository;
        public IRepository<Answer> AnswerRepository
        {
            get
            {
                return _answerRepository = _answerRepository ?? new EfRepository<Answer>(_dbContext);
            }
        }

        private IRepository<GdprTask> _gdprTaskRepository;
        public IRepository<GdprTask> GdprTaskRepository
        {
            get
            {
                return _gdprTaskRepository = _gdprTaskRepository ?? new EfRepository<GdprTask>(_dbContext);
            }
        }

        private IRepository<PolicyTemplate> _policyTemplateRepository;
        public IRepository<PolicyTemplate> PolicyTemplateRepository
        {
            get
            {
                return _policyTemplateRepository = _policyTemplateRepository ?? new EfRepository<PolicyTemplate>(_dbContext);
            }
        }

        private IRepository<PolicyChangeLog> _policyChangeLogRepository;
        public IRepository<PolicyChangeLog> PolicyChangeLogRepository
        {
            get
            {
                return _policyChangeLogRepository = _policyChangeLogRepository ?? new EfRepository<PolicyChangeLog>(_dbContext);
            }
        }

        private IRepository<DataProcessorTemplate> _dataProcessorTemplateRepository;
        public IRepository<DataProcessorTemplate> DataProcessorTemplateRepository
        {
            get
            {
                return _dataProcessorTemplateRepository = _dataProcessorTemplateRepository ?? new EfRepository<DataProcessorTemplate>(_dbContext);
            }
        }

        private IRepository<DataProcessorChangeLog> _dataProcessorChangeLogRepository;
        public IRepository<DataProcessorChangeLog> DataProcessorChangeLogRepository
        {
            get
            {
                return _dataProcessorChangeLogRepository = _dataProcessorChangeLogRepository ?? new EfRepository<DataProcessorChangeLog>(_dbContext);
            }
        }

        private IRepository<Process> _processRepository;
        public IRepository<Process> ProcessRepository
        {
            get
            {
                return _processRepository = _processRepository ?? new EfRepository<Process>(_dbContext);
            }
        }

        private IRepository<Policy> _policyRepository;
        public IRepository<Policy> PolicyRepository
        {
            get
            {
                return _policyRepository = _policyRepository ?? new EfRepository<Policy>(_dbContext);
            }
        }

        private IRepository<DataProcessor> _dataProcessorRepository;
        public IRepository<DataProcessor> DataProcessorRepository
        {
            get
            {
                return _dataProcessorRepository = _dataProcessorRepository ?? new EfRepository<DataProcessor>(_dbContext);
            }
        }

        private IRepository<KeyValue> _keyValueRepository;
        public IRepository<KeyValue> KeyValueRepository
        {
            get
            {
                return _keyValueRepository = _keyValueRepository ?? new EfRepository<KeyValue>(_dbContext);
            }
        }

        private IRepository<FileUploaded> _fileUploadedRepository;
        public IRepository<FileUploaded> FileUploadedRepository
        {
            get
            {
                return _fileUploadedRepository = _fileUploadedRepository ?? new EfRepository<FileUploaded>(_dbContext);
            }
        }

        private IRepository<Counterpart> _counterpartRepository;
        public IRepository<Counterpart> CounterpartRepository
        {
            get
            {
                return _counterpartRepository = _counterpartRepository ?? new EfRepository<Counterpart>(_dbContext);
            }
        }

        private IRepository<Risk> _riskRepository;
        public IRepository<Risk> RiskRepository
        {
            get
            {
                return _riskRepository = _riskRepository ?? new EfRepository<Risk>(_dbContext);
            }
        }

        private IRepository<TodoTemplate> _todoTemplateRepository;
        public IRepository<TodoTemplate> TodoTemplateRepository
        {
            get
            {
                return _todoTemplateRepository = _todoTemplateRepository ?? new EfRepository<TodoTemplate>(_dbContext);
            }
        }
        private IRepository<Todo> _todoRepository;
        public IRepository<Todo> TodoRepository
        {
            get
            {
                return _todoRepository = _todoRepository ?? new EfRepository<Todo>(_dbContext);
            }
        }
        private IRepository<History> _historyRepository;
        public IRepository<History> HistoryRepository
        {
            get
            {
                return _historyRepository = _historyRepository ?? new EfRepository<History>(_dbContext);
            }
        }

        private IRepository<ChangeLog> _changeLogRepository;
        public IRepository<ChangeLog> ChangeLogRepository
        {
            get
            {
                return _changeLogRepository = _changeLogRepository ?? new EfRepository<ChangeLog>(_dbContext);
            }
        }

        private IRepository<CompanyAddOn> _companyAddOnRepository;

        public IRepository<CompanyAddOn> CompanyAddOnRepository
        {
            get
            {
                return _companyAddOnRepository = _companyAddOnRepository ?? new EfRepository<CompanyAddOn>(_dbContext);
            }
        }

        private IRepository<AddOn> _addOnRepository;
        public IRepository<AddOn> AddOnRepository
        {
            get
            {
                return _addOnRepository = _addOnRepository ?? new EfRepository<AddOn>(_dbContext);
            }
        }

        private IRepository<GdprDocument> _gdprDocument;
        public IRepository<GdprDocument> GdprDocumentRepository
        {
            get
            {
                return _gdprDocument = _gdprDocument ?? new EfRepository<GdprDocument>(_dbContext);
            }
        }

        private IRepository<Purpose> _purposeRepository;
        public IRepository<Purpose> PurposeRepository
        {
            get
            {
                return _purposeRepository = _purposeRepository ?? new EfRepository<Purpose>(_dbContext);
            }
        }

        private IRepository<DeletionJustification> _deletionJustificationRepository;
        public IRepository<DeletionJustification> DeletionJustificationRepository
        {
            get
            {
                return _deletionJustificationRepository = _deletionJustificationRepository ?? new EfRepository<DeletionJustification>(_dbContext);
            }
        }

        private IRepository<OverviewPageSetting> _overviewPageSettingRepository;
        public IRepository<OverviewPageSetting> OverviewPageSettingRepository
        {
            get
            {
                return _overviewPageSettingRepository =
                    _overviewPageSettingRepository ?? new EfRepository<OverviewPageSetting>(_dbContext);
            }
        }

        private IRepository<OverviewPageSettingRole> _overviewPageSettingRoleRepository;
        public IRepository<OverviewPageSettingRole> OverviewPageSettingRoleRepository
        {
            get
            {
                return _overviewPageSettingRoleRepository =
                    _overviewPageSettingRoleRepository ?? new EfRepository<OverviewPageSettingRole>(_dbContext);
            }
        }

        private IRepository<Vendor> _vendorRepository;
        public IRepository<Vendor> VendorRepository
        {
            get
            {
                return _vendorRepository = _vendorRepository ?? new EfRepository<Vendor>(_dbContext);
            }
        }

        private IRepository<VendorTag> _vendorTagRepository;
        public IRepository<VendorTag> VendorTagRepository
        {
            get
            {
                return _vendorTagRepository = _vendorTagRepository ?? new EfRepository<VendorTag>(_dbContext);
            }
        }

        public void SaveChange()
        {
            _dbContext.SaveChanges();
        }

        public async Task SaveChangeAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
