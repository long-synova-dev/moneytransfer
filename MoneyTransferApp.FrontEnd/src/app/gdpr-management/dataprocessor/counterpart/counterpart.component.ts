import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { slideInOutTransition } from '../../../animations/slide-transition';

import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'ng-select';

import { CompanyTagService } from '../../../shared/services/company-tag.service';
import { DataService } from '../../../shared/services/data.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Globals } from '../../../shared/global/global';
import { DataprocessorService } from '../../../shared/services/dataprocessor.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
    templateUrl: './counterpart.component.html',
    styleUrls: ['../../management.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class CounterpartComponent implements OnInit {
    dataprocessorId;
    ready;
    counterpartInfoForm: FormGroup;
    companyDetailCtrl: FormGroup;
    subCompanyCtrl: FormArray;
    subCompanies: any[];
    overallResponsibleCtrl: FormGroup;
    signaturePersonCtrl: FormGroup;

    defineCountry: Array<IOption>;
    defineLanguage: Array<IOption>;

    firstData;
    storageData: Object = {
        'subCompanys': [],
        'overallResponsible': null,
        'signaturePersonInfomation': null
    };

    initSubCompany = (company): FormGroup => {
        return this._formBuilder.group({
            'name': [company.name, Validators.required],
            'registration': [company.registration,],
            'companyAddress': [company.companyAddress],
            'zipCode': [company.zipCode],
            'city': [company.city],
            'country': [company.country]
        });
    };
    initUserInfomation = (company): FormGroup => {
        return this._formBuilder.group({
            'title': [company && company.title ? company.title : null],
            'firstName': [company && company.firstName ? company.firstName : null],
            'lastName': [company && company.lastName ? company.lastName : null],
            'phone': [company && company.phone ? company.phone : null],
            'email': [company && company.email ? company.email : null, Validators.compose([Validators.pattern(Globals.EMAIL_REGEX_VALIDATE)])]
        });
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _companyTagService: CompanyTagService,
        private _translate: TranslateService,
        private _data: DataService,
        private _alert: AlertService,
        private _router: Router,
        private _dataprocessor: DataprocessorService,
        private _userService: UserService
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);
        this.dataprocessorId = this._dataprocessor.getSharedDataId();
        this.subCompanies = [];

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_ALL_COUNTRIES, false)
            .then(data => this.defineCountry = this._convertResponseToOptions(data));

        this._userService.getLanguages()
            .then((response) => {
                this.defineLanguage = response.map(item => {
                    return {
                        label: item.languageName,
                        value: item.languageId.toString()
                    }
                });
            });

        if (this.dataprocessorId) {
            this._dataprocessor.getCounterpart(this.dataprocessorId)
                .then(response => {
                    console.log(response);
                    this.firstData = response;
                    this.formInit(this.firstData);
                    this._data.changeLoadStatus(false);
                    this.ready = true;
                })
            this.formInit(this.firstData);
        } else {
            this._router.navigate(['gdpr','management', 'dataprocessor-management', this.dataprocessorId]);
        }
    }

    formInit(data) {
        this.subCompanyCtrl = this._formBuilder.array([]);
        if (data != undefined && data.subsidiaries != null) {
            data.subsidiaries.forEach(element => {
                this.addSubCompany(element);
            });
        };

        if (data != undefined && data.contactPerson != null) {
            this.overallResponsibleCtrl = this.initUserInfomation(data.contactPerson);
        } else {
            this.overallResponsibleCtrl = this.initUserInfomation({});
        }

        if (data != undefined && data.signaturePerson != null) {
            this.signaturePersonCtrl = this.initUserInfomation(data.signaturePerson);
        } else {
            this.signaturePersonCtrl = this.initUserInfomation({});
        }

        this.companyDetailCtrl = this._formBuilder.group({
            'registration': [data && data.counterpartDetail ? data.counterpartDetail.registration : null],
            'vatRegistrationNo': [data && data.counterpartDetail ? data.counterpartDetail.vatRegistrationNo : null],
            'companyAddress': [data && data.counterpartDetail ? data.counterpartDetail.companyAddress : null],
            'zipCode': [data && data.counterpartDetail ? data.counterpartDetail.zipCode : null],
            'city': [data && data.counterpartDetail ? data.counterpartDetail.city : null],
            'country': [data && data.counterpartDetail ? data.counterpartDetail.country : null, Validators.required],
        });

        this.counterpartInfoForm = this._formBuilder.group({
            'companyName': [data ? data.companyName : null],
            'language': [data ? data.language: null, Validators.required],
            'counterpartDetail': this.companyDetailCtrl,
            'isHasSub': [data ? data.isHasSub : false],
            'subsidiaries': this.subCompanyCtrl,
            'contactPerson': this.overallResponsibleCtrl,
            'isSignature': [data ? data.isSignature : false],
            'signaturePerson': this.signaturePersonCtrl
        });

        if (!this.counterpartInfoForm.controls['isSignature'].value) {
            this.counterpartInfoForm.removeControl('signaturePerson');
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
        let isTrue = this.counterpartInfoForm.controls['isHasSub'].value;
        let isFirstActive = this.subCompanyCtrl.length === 0 ? true : false;
        if (!isTrue) {
            let data = this.counterpartInfoForm.controls['subsidiaries'].value;
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
    isSignaturechange() {
        let isTrue = this.counterpartInfoForm.controls['isSignature'].value;
        if (!isTrue) {
            let data = this.counterpartInfoForm.controls['signaturePerson'].value;
            Object.assign(this.storageData, { 'signaturePersonInfomation': data });
            this.counterpartInfoForm.removeControl('signaturePerson');
        } else {
            this.counterpartInfoForm.removeControl('signaturePerson');
            this.signaturePersonCtrl = this.initUserInfomation(this.storageData['signaturePersonInfomation']);
            this.counterpartInfoForm.addControl('signaturePerson', this.signaturePersonCtrl);
        }
    }

    onSubmit(value) {
        if (this.counterpartInfoForm.valid) {
            this.saveGDPRInfo(value)
                .then(() => {
                    this._router.navigate(['gdpr','management','dataprocessor-management', this.dataprocessorId]);
                    this._dataprocessor.updateCounterpartStatus(true);
                });
        } else {
            this.validateAllForm(this.counterpartInfoForm);
            this._translate.get('Counterpart.ValidationError').subscribe(value => this._alert.error(value));
        }
    }
    saveGDPRInfo(value): Promise<any> {
        let def = new Promise((resolve, reject) => {
            this._data.changeLoadStatus(true);
            value['dataProcessorId'] = this.dataprocessorId;
            this._dataprocessor.updateCounterpart(value)
                .then(response => {
                    this._data.changeLoadStatus(false);
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value));
                    return resolve();
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