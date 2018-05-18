import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'ng-select';

import { fadeTransition } from '../../animations/fade-transition';
import { CompanyInfoService } from '../../shared/services/company-info.service';
import { CompanyTagService } from '../../shared/services/company-tag.service';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';
import { Globals } from '../../shared/global/global';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
@Component({
    selector: 'gdpr-page',
    templateUrl: './gdpr-first-step.component.html',
    styleUrls: ['../gdpr.component.css'],
    animations: [fadeTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprFirstStepComponent implements OnInit {
    ready;
    gdprFirstStepForm: FormGroup;
    companyDetailCtrl: FormGroup;
    subCompanyCtrl: FormArray;
    subCompanies: any[];
    overallResponsibleCtrl: FormGroup;
    DPOinfomationCtrl: FormGroup;

    defineIndustry: Array<IOption>;
    defineCurrency: Array<IOption>;
    defineNumOfEployees: Array<IOption>;
    defineCountry: Array<IOption>;

    firstData;
    storageData: Object = {
        'subCompanys': [],
        'overallResponsible': null,
        'DPOinfomation': null
    };
    
    numberMask = createNumberMask({
        prefix: '',
        suffix: '',
        thousandsSeparatorSymbol: '.',
        allowLeadingZeroes: true,
        allowNegative: true,
        integerLimit: 9
    });

    initSubCompany = (company): FormGroup => {
        return this._formBuilder.group({
            'name': [company.name],
            'registration': [company.registration, Validators.required],
            'companyAddress': [company.companyAddress, Validators.required],
            'zipCode': [company.zipCode, Validators.required],
            'city': [company.city, Validators.required],
            'country': [company.country, Validators.required]
        });
    };
    initUserInfomation = (company): FormGroup => {
        return this._formBuilder.group({
            'title': [company && company.title ? company.title : null, Validators.required],
            'firstName': [company && company.firstName ? company.firstName : null, Validators.required],
            'lastName': [company && company.lastName ? company.lastName : null, Validators.required],
            'phone': [company && company.phone ? company.phone : null, Validators.required],
            'email': [company && company.email ? company.email : null, Validators.compose([Validators.required, Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])]
        });
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _companyInfoService: CompanyInfoService,
        private _companyTagService: CompanyTagService,
        private _translate: TranslateService,
        private _data: DataService,
        private _alert: AlertService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);
        this.subCompanies = [];

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_INDUSTRY, false)
            .then(data => this.defineIndustry = this._convertResponseToOptions(data));

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_NUMBER_OF_EMPLOYEES, false)
            .then(data => this.defineNumOfEployees = this._convertResponseToOptions(data));

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_CURRENCY, false)
            .then(data => this.defineCurrency = this._convertResponseToOptions(data));

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_ALL_COUNTRIES, false)
            .then(data => this.defineCountry = this._convertResponseToOptions(data));

        this._companyInfoService.loadDataGDPRFirstStep()
            .then(reponse => {
                this.firstData = reponse;
                this.formInit(this.firstData);
                this._data.changeLoadStatus(false);
                this.ready = true;
            });

        this.formInit(this.firstData);
    }

    formInit(data) {
        this.subCompanyCtrl = this._formBuilder.array([]);
        if (data != undefined && data.subsidiariesViewModel != null) {
            data.subsidiariesViewModel.forEach(element => {
                this.addSubCompany(element);
            });
        };

        if (data != undefined && data.overallResponsible != null) {
            this.overallResponsibleCtrl = this.initUserInfomation(data.overallResponsible);
        } else {
            this.overallResponsibleCtrl = this.initUserInfomation({});
        }

        if (data != undefined && data.dpo != null) {
            this.DPOinfomationCtrl = this.initUserInfomation(data.dpo);
        } else {
            this.DPOinfomationCtrl = this.initUserInfomation({});
        }

        this.companyDetailCtrl = this._formBuilder.group({
            'registration': [data && data.companyDetailViewModel ? data.companyDetailViewModel.registration : null, Validators.required],
            'industry': [data && data.companyDetailViewModel ? data.companyDetailViewModel.industry : '', Validators.required],
            'turnOver': [data && data.companyDetailViewModel ? data.companyDetailViewModel.turnOver : null],
            'numOfEployees': [data && data.companyDetailViewModel ? data.companyDetailViewModel.numOfEployees : '', Validators.required],
            'lastResult': [data && data.companyDetailViewModel ? data.companyDetailViewModel.lastResult : null],
            'currency': [data && data.companyDetailViewModel ? data.companyDetailViewModel.currency : '', Validators.required],
            'companyAddress': [data && data.companyDetailViewModel ? data.companyDetailViewModel.companyAddress : null, Validators.required],
            'zipCode': [data && data.companyDetailViewModel ? data.companyDetailViewModel.zipCode : null, Validators.required],
            'city': [data && data.companyDetailViewModel ? data.companyDetailViewModel.city : null, Validators.required],
            'country': [data && data.companyDetailViewModel ? data.companyDetailViewModel.country : null, Validators.required],
        });

        this.gdprFirstStepForm = this._formBuilder.group({
            'companyName': [data ? data.companyName : null, Validators.required],
            'companyDetailViewModel': this.companyDetailCtrl,
            'isHasSub': [data ? data.isHasSub : false],
            'subsidiariesViewModel': this.subCompanyCtrl,
            'isSelfOverallResponsible': [data ? data.isSelfOverallResponsible : false],
            'overallResponsible': this.overallResponsibleCtrl,
            'isHasDPO': [data ? data.isHasDPO : false],
            'dpo': this.DPOinfomationCtrl
        });

        if (!this.gdprFirstStepForm.controls['isHasDPO'].value) {
            this.gdprFirstStepForm.removeControl('dpo');
        }
        if (this.gdprFirstStepForm.controls['isSelfOverallResponsible'].value) {
            this.gdprFirstStepForm.removeControl('overallResponsible');
        }
    }

    addSubCompany(company) {
        this.subCompanyCtrl.push(this.initSubCompany(company));
    }
    removeSubCompany(index) {
        this.subCompanyCtrl.removeAt(index);
    }
    removeAllSubCompany() {
        let length = this.subCompanyCtrl.controls.length;
        for (let i = 0; i < length; i++) {
            this.removeSubCompany(0);
        }
    }

    hasSubCompanyChange() {
        let isTrue = this.gdprFirstStepForm.controls['isHasSub'].value;
        let isFirstActive = this.subCompanyCtrl.length === 0 ? true : false;
        if (!isTrue) {
            let data = this.gdprFirstStepForm.controls['subsidiariesViewModel'].value;
            Object.assign(this.storageData, { 'subCompanys': data });
            this.removeAllSubCompany();
        } else {
            if (isFirstActive) {
                this.subCompanyCtrl.push(this.initSubCompany({}));
            } else {
                this.storageData['subCompanys'].forEach((item) => {
                    this.subCompanyCtrl.push(this.initSubCompany(item));
                })
            }
        }
    }
    ishasDPOchange() {
        let isTrue = this.gdprFirstStepForm.controls['isHasDPO'].value;
        if (!isTrue) {
            let data = this.gdprFirstStepForm.controls['dpo'].value;
            Object.assign(this.storageData, { 'DPOinfomation': data });
            this.gdprFirstStepForm.removeControl('dpo');
        } else {
            this.gdprFirstStepForm.removeControl('dpo');
            this.DPOinfomationCtrl = this.initUserInfomation(this.storageData['DPOinfomation']);
            this.gdprFirstStepForm.addControl('dpo', this.DPOinfomationCtrl);
        }
    }
    isSelfOverallResponsibleChange() {
        let isTrue = this.gdprFirstStepForm.controls['isSelfOverallResponsible'].value;
        if (isTrue) {
            let data = this.gdprFirstStepForm.controls['overallResponsible'].value;
            Object.assign(this.storageData, { 'overallResponsible': data });
            this.gdprFirstStepForm.removeControl('overallResponsible');
        } else {
            this.gdprFirstStepForm.removeControl('overallResponsible');
            this.overallResponsibleCtrl = this.initUserInfomation(this.storageData['overallResponsible']);
            this.gdprFirstStepForm.addControl('overallResponsible', this.overallResponsibleCtrl);
        }
    }

    onSubmit(value) {
        if (this.gdprFirstStepForm.valid) {
            this.saveGDPRInfo(value,false)
                .then(() => this._router.navigate(['gdpr-wizard','data-analysis','step-1']));
        } else {
            //this.touched = true;
            this.validateAllForm(this.gdprFirstStepForm);
            this._translate.get('FirstStep.ValidationError').subscribe(value => this._alert.error(value));
        }
    }
    saveGDPRInfo(value,isNav): Promise<any> {
        let def = new Promise((resolve, reject) => {
            this._data.changeLoadStatus(true);
            this._companyInfoService.updateDataGDPRFirstStep(value)
                .then(response => {
                    this._data.changeLoadStatus(false);
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value));
                    if(isNav)
                    {
                        this._router.navigate(['gdpr-wizard','getstarted']);
                    }
                    else
                    {
                        return resolve();
                    }
                    
                });
        });
        return def;
    }

    validateAllForm(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            let form = formGroup.get(field);
            if (form instanceof FormControl) {
                form.markAsTouched({ onlySelf: true });
            };
            if (form instanceof FormGroup) {
                this.validateAllForm(form);
            };
            if (form instanceof FormArray) {
                let groupOfArray = form.controls;
                groupOfArray.forEach((group) => {
                    if (group instanceof FormGroup) {
                        this.validateAllForm(group);
                    }
                })
            }
        })
    }

    private _convertResponseToOptions(data) {
        var mapped = data.map(item => {
            return {
                label: item.tagName,
                value: item.tagId
            }
        });

        return mapped;
    }
}