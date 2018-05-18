import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { slideInOutTransition } from '../../../animations/slide-transition';
import { IOption } from 'ng-select';
import { CompanyTagService } from '../../../shared/services/company-tag.service';
import { DataService } from '../../../shared/services/data.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Globals } from '../../../shared/global/global';
import { Common } from '../../../shared/global/common';
import { Tag } from '../../../shared/models/tag.model';
import { TreePath } from '../../../shared/models/tree-path.model';
import { TranslateService } from '@ngx-translate/core';
import { StepCancelComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './data-processing-ex.component.html',
    styleUrls: ['../../gdpr.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class DataProcessingExComponent implements OnInit {
    listHosting;
    defineListHosting:Array<IOption>;
    selectedHosting;

    listServiceProvider;
    defineListServiceProvider: Array<IOption>;
    customProvider;
    selectedProvider;

    listAccessMethods;
    selectedAccessMethods: Array<Array<Tag>> = new Array<Array<Tag>>();
    customAccessMethod;

    listSecurityMeasure;
    selectedSecurityMeasure: Array<Array<Tag>> = new Array<Array<Tag>>();
    customSecurityMeasure;

    shareTuple: Array<Tag>;
    tuples: Array<Array<Tag>> = new Array<Array<Tag>>();

    question;
    questionAttribute;
    isPrivacyAgreed = false;

    constructor(
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _router: Router,
        private _alert: AlertService,
        private _translate: TranslateService,
        private _matDialog: MatDialog
    ) {}

    ngOnInit() {
        this.shareTuple = this._companyTagService.getSharedTuple();
        if (!this.shareTuple) {
            this.shareTuple = new Array<Tag>();
            this._router.navigate(['gdpr-wizard', 'data-processing']);
            return;
        }

        this._companyTagService.getQuestionByCode(Globals.QUESTION_PRIVACY_DATA)
        .then(response => {
            this.question = response;
            this.questionAttribute = "Question" + response.questionId;
        });

        this._data.getIOptions.subscribe(options => {
            this.defineListServiceProvider = options;
        })

        // Load list IT Systems
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_IT_SYSTEM_TYPE)
            .then(data => {
                this.listHosting = data;
                this.defineListHosting = Common.convertResponseToOptions(data);
                // Load selected IT System
                this._companyTagService.traverseTree(new TreePath([this.shareTuple[0].tagId], Globals.CATEGORY_IT_SYSTEM_TYPE))
                    .then(data => {
                        if (data[0]) {this.selectedHosting = data[0][1].tagId}
                        this.tuples.push(...data);

                        if (this.tuples[0][1].rowData) {
                            let attr = this.tuples[0][0].rowData.find(r => r.name === this.questionAttribute);
                            if (attr != null) {
                                this.isPrivacyAgreed = attr.value === "true";
                            }
                        }
                    });
                });
        // Load Service provider
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_IT_SYSTEM_SERVICE_PROVIDER)
            .then(data => {
                this.listServiceProvider = data;
                this._data.changeIOpitons(Common.convertResponseToOptions(data));
                // Load selected service provider
                this._companyTagService.traverseTree(new TreePath([this.shareTuple[0].tagId],Globals.CATEGORY_IT_SYSTEM_SERVICE_PROVIDER))
                    .then(data => {
                        if (data[0]) {this.selectedProvider = data[0][1].tagId}
                        this.tuples.push(...data);
                    });
            });
        // Load accessMethod
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_ACCESS_METHOD)
            .then(data => {
                this.listAccessMethods = data;
                // Load selected access
                this._companyTagService.traverseTree(new TreePath([this.shareTuple[0].tagId], Globals.CATEGORY_ACCESS_METHOD))
                    .then(data =>{
                        this.selectedAccessMethods.push(...data);
                        this.selectedAccessMethods.forEach(method => {
                            let selected = this.listAccessMethods.find(item => item.tagId === method[1].tagId);
                            selected.marked = true;
                        })
                    });
            });
        // Load security measure
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_SECURITY_MEASURE)
            .then(data => {
                this.listSecurityMeasure = data;
                // Load selected measure
                this._companyTagService.traverseTree(new TreePath([this.shareTuple[0].tagId], Globals.CATEGORY_SECURITY_MEASURE))
                .then(data =>{
                    this.selectedSecurityMeasure.push(...data);
                    this.selectedSecurityMeasure.forEach(measure => {
                        let selected = this.listSecurityMeasure.find(item => item.tagId === measure[1].tagId);
                        selected.marked = true;
                    })
                });
            });
    };

    selectAccessMethod(method) {
        method.marked = true;
        let existedInTree = false;
        this.selectedAccessMethods.forEach(access => {
            if (access[1].tagId == method.tagId && access[1].fromTree) {
                access[1].deleting = false;
                existedInTree = true;
            }
        });
        if(!existedInTree) {
            let access = [...this.shareTuple, method];
            this.selectedAccessMethods.push(access);
        }
    };
    unSelectAccessMethod(method) {
        let existedInTree = false;
        this.selectedAccessMethods.forEach(access => {
            if (access[1].tagId == method.tagId && access[1].fromTree) {
                access[1].deleting = true;
                existedInTree = true;
            }
        });
        if (!existedInTree) {
            this.selectedAccessMethods = this.selectedAccessMethods.filter(access => access[1].tagId !== method.tagId);
        }

        this.listAccessMethods.forEach(item => {
            if (item.tagId === method.tagId) {
                item.marked = false;
            }
        });
    };

    selectSecurityMeasure(measure) {
        measure.marked = true;
        let existedInTree = false;
        this.selectedSecurityMeasure.forEach(access => {
            if (access[1].tagId == measure.tagId && access[1].fromTree) {
                access[1].deleting = false;
                existedInTree = true;
            }
        });
        if(!existedInTree) {
            let access = [...this.shareTuple, measure];
            this.selectedSecurityMeasure.push(access);
        }
    }
    unSelectSecurityMeasure(measure) {
        let existedInTree = false;
        this.selectedSecurityMeasure.forEach(item => {
            if (item[1].tagId == measure.tagId && item[1].fromTree) {
                item[1].deleting = true;
                existedInTree = true;
            }
        });
        if (!existedInTree) {
            this.selectedSecurityMeasure = this.selectedSecurityMeasure.filter(item => item[1].tagId !== measure.tagId);
        }
        this.listSecurityMeasure.forEach(item => {
            if (item.tagId === measure.tagId) {
                item.marked = false;
            }
        });
    };


    save() {
        let hosting = this.listHosting.find(hosting => hosting.tagId === this.selectedHosting);
        let provider = this.listServiceProvider.find(provider => provider.tagId === this.selectedProvider);

        if (!hosting) {
            this._translate.get('DataProcessing.ValidationNoHosting').subscribe(value => {this._alert.error(value);})
            return;
        };
        if (!provider) {
            this._translate.get('DataProcessing.ValidationNoProvider').subscribe(value => {this._alert.error(value);})
            return;
        };
        if (this.selectedAccessMethods.length === 0) {
            this._translate.get('DataProcessing.ValidationNoAccess').subscribe(value => {this._alert.error(value);})
            return;
        };
        if (this.selectedSecurityMeasure.length === 0) {
            this._translate.get('DataProcessing.ValidationNoSecurityMeasure').subscribe(value => {this._alert.error(value);})
            return;
        };

        this._data.changeLoadStatus(true);
        var sharedTupledWithQuestion = Object.assign({},this.shareTuple[0] );
        sharedTupledWithQuestion.rowData = [{ name:  this.questionAttribute, value: this.isPrivacyAgreed.toString() }];

        this.tuples.push(new Array<Tag>(sharedTupledWithQuestion, hosting));
        this.tuples.push(new Array<Tag>(this.shareTuple[0], provider));
        this.tuples.forEach(tuple => {
            if (
                tuple[1].tagId != this.selectedHosting &&
                tuple[1].tagId != this.selectedProvider
            ){tuple[1].deleting = true;}
        })
        this.tuples.push(...this.selectedAccessMethods);
        this.tuples.push(...this.selectedSecurityMeasure);

        this._companyTagService.addTagToTree(this.tuples)
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('DataProcessing.SavedSucess').subscribe(value => {this._alert.success(value, null, true, true);})
                }
                this._data.changeLoadStatus(false);                
                this._router.navigate(['gdpr-wizard', 'data-processing']);
            });
    }
    addCustomProvider() {
        if (this.customProvider) {
            let newTag = new Tag(this.customProvider, Globals.CATEGORY_IT_SYSTEM_SERVICE_PROVIDER, null);
            let existed = false;

            this.listServiceProvider.filter(item => {
                if (item.tagName === newTag.tagName) {
                    item.deleting = false;
                    existed = true;
                    this._alert.error("Invalid Name", null, true, true);
                    this.customProvider = '';
                }
            });

            if (!existed) {
                let defineItem = this.listServiceProvider;
                defineItem.push(newTag);
                this._data.changeIOpitons(Common.convertResponseToOptions(defineItem));
                this.selectedProvider = newTag.tagId;
                this.customProvider = '';
            }
        }
    }
    addCustomAccessMethod() {
        if (this.customAccessMethod) {
            let newTag = new Tag(this.customAccessMethod, Globals.CATEGORY_ACCESS_METHOD, null);
            let existed = false;

            this.listAccessMethods.filter(item => {
                if (item.tagName === newTag.tagName) {
                    item.deleting = false;
                    existed = true;
                    this._alert.error("Invalid Name", null, true, true);
                    this.customAccessMethod = '';
                }
            })
            if (!existed) {
                this.listAccessMethods.push(newTag);
                this.selectAccessMethod(newTag);
                this.customAccessMethod = '';
            }
        }
    }
    addCustomSecurityMeasure() {
        if (this.customSecurityMeasure) {
            let newTag = new Tag(this.customSecurityMeasure, Globals.CATEGORY_SECURITY_MEASURE, null);
            let existed = false;

            this.listSecurityMeasure.filter(item => {
                if (item.tagName === newTag.tagName) {
                    item.deleting = false;
                    existed = true;
                    this._alert.error("Invalid Name", null, true, true);
                    this.customSecurityMeasure = '';
                }
            })
            if (!existed) {
                this.listSecurityMeasure.push(newTag);
                this.selectSecurityMeasure(newTag);
                this.customSecurityMeasure = '';
            }
        }
    }
    goBack() {
        this._companyTagService.isStepSaved(false);
    }
}