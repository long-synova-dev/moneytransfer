import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../../../animations/fade-transition';
import { tableAddRowTransition } from '../../../animations/table-add-transition';
import { tableColumnHighlightTransition } from '../../../animations/table-column-highlight-transition';
import { IOption } from 'ng-select';

import { CompanyTagService } from '../../../shared/services/company-tag.service';
import { CompanyInfoService } from '../../../shared/services/company-info.service';
import { Globals } from '../../../shared/global/global';
import { Tag } from '../../../shared/models/tag.model';
import { TreePath } from '../../../shared/models/tree-path.model';
import { DataService } from '../../../shared/services/data.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './gdpr-data-analysis-step-3.component.html',
    styleUrls: ['../../gdpr.component.css'],
    animations: [fadeTransition(), tableAddRowTransition(), tableColumnHighlightTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprDataAnalysisStep3Component implements OnInit {
    ready: boolean = false;
    customDataType: string;
    customDataTypeTagTypeId: string;
    sharedTuple;
    sharedTupleMarkedInTree;
    defineTagType;

    listSelectedProcesses: Array<Tag>;
    listPersonalDataTypes: Array<Tag>;
    tuples: Array<Array<Tag>>;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _alert: AlertService,
        private _translate: TranslateService,
        private _companyInfoService: CompanyInfoService
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);
        this._companyTagService.getTypesByCategory(Globals.CATEGORY_PERSONAL_DATA_TYPE)
            .then(data => this.defineTagType = data);
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_PERSONAL_DATA_TYPE, null)
            .then(data => {
                this.listPersonalDataTypes = data;
                this._companyTagService.getTagsByCategory(Globals.CATEGORY_PROCESS, true)
                    .then(data => {
                        this.listSelectedProcesses = data;
                        if (this.listSelectedProcesses.length === 0) {
                            this._translate.get('SecondStep.ValidationNoProcess').subscribe(value => this._alert.error(value, null, true, true));
                            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-1']);
                            return;
                        }
                        this._companyTagService.traverseTree(new TreePath(["", ""], Globals.CATEGORY_PERSONAL_DATA_TYPE))
                            .then(data => {
                                this.tuples = data;
                                this.listPersonalDataTypes.forEach(type => {
                                    type.rowData = this.listSelectedProcesses.map(pro => Object.assign({}, pro));
                                    type.rowData.forEach(process => {
                                        if (this.tuples.find(tuple => tuple[0].tagId === process.tagId && tuple[2].tagId === type.tagId)) {
                                            process.marked = true;
                                            process.fromTree = true;
                                        };
                                        if (this.tuples.find(tuple => tuple[0].tagId === process.tagId 
                                                                        && tuple[2].tagId === type.tagId 
                                                                        && tuple[2].step3NoCompleted == true)) {
                                            process.step3NoCompleted = true;
                                        }
                                    });
                                });
                                this.ready = true;
                                this._data.changeLoadStatus(false);
                            });
                    });
            });

        this._unselectIfUserClickBackInInner();
    }

    click(dataType: Tag, process: Tag, event) {
        if (process.marked) {
            event.target.parentElement.classList.toggle("show-edit");
        } else {
            process.marked = true;
            this.sharedTuple = new Array(process, dataType);
            this.sharedTupleMarkedInTree = false;
            this._companyTagService.setSharedTuple(this.sharedTuple);
            this._router.navigate(['3b'], { relativeTo: this._activatedRoute });
        }
    }

    uncheck(dataType: Tag, process: Tag, event) {
        //Process tuple
        this.tuples.forEach(tuple => {
            if (tuple[0].tagId === process.tagId && tuple[2].tagId === dataType.tagId) {
                tuple[2].deleting = true;
            }
        });

        //Save
        this.save(false);

        //Update UI
        process.marked = false;
        process.step3NoCompleted = false;
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
    }

    edit(dataType: Tag, process: Tag, event) {
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
        this.sharedTuple = new Array(process, dataType);
        this.sharedTupleMarkedInTree = true;
        this._companyTagService.setSharedTuple(this.sharedTuple);
        this._router.navigate(['3b'], { relativeTo: this._activatedRoute });
    }

    addCustomDataType() {
        if (this.customDataType && this.customDataTypeTagTypeId) {
            let newTag = new Tag(this.customDataType, Globals.CATEGORY_PERSONAL_DATA_TYPE, this.customDataTypeTagTypeId);
            newTag.rowData = this.listSelectedProcesses.map(pro => Object.assign({}, pro));
            this.listPersonalDataTypes.push(newTag);
            this.customDataType = null;
            this.customDataTypeTagTypeId = null;
        }
    }

    save(cont: boolean) {
        if (cont && !this._validate()) {
            return;
        }
        this._data.changeLoadStatus(true);
        this._companyTagService.addTagToTree(this.tuples)
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value, null, true, true));
                    this._data.changeLoadStatus(false);
                    if (cont) {
                        this._companyTagService.isStepSaved(true);
                        this._companyInfoService.updateWizardStatus({step: 2, percent: 100, isCompleted: true})
                        .then(() => {
                            this._router.navigate(['gdpr-wizard', 'data-processing']);
                        });
                    } else {
                        this._router.navigate(['gdpr-wizard', 'getstarted']);
                    }
                };
            });
    }

    _validate() {
        let valid = true;
        this.listSelectedProcesses.forEach(process => {
            if (!this.listPersonalDataTypes.find(type =>
                type.rowData.find(innerProcess => innerProcess.tagId == process.tagId && innerProcess.marked))) {
                valid = false;
                process.validateState = 'invalid';
                this.listPersonalDataTypes.forEach(type => {
                    type.rowData.forEach(innerProcess => {
                        if (innerProcess.tagId == process.tagId) {
                            innerProcess.validateState = 'invalid';
                        }
                    })
                })
            }
        });

        let timer = Observable.timer(2000).subscribe(() => {
            this.listSelectedProcesses.forEach(process => process.validateState = 'valid');
            this.listPersonalDataTypes.forEach(type => {
                type.rowData.forEach(innerProcess => {
                    innerProcess.validateState = "valid";
                });
            });
            timer.unsubscribe();
        });

        if (!valid) {
            this._translate.get('SecondStep.ValidationNoDataType').subscribe(value => this._alert.error(value));
        }

        return valid;
    }

    private _unselectIfUserClickBackInInner() {
        this._companyTagService.isSaved.subscribe(saved => {
            if (!saved && this.sharedTuple && this.sharedTuple[0] && this.sharedTuple[1]) {
                this.listPersonalDataTypes.forEach(type => {
                    type.rowData.forEach(process => {
                        if (process.tagId === this.sharedTuple[0].tagId && type.tagId == this.sharedTuple[1].tagId) {
                            process.marked = this.sharedTupleMarkedInTree;
                        }
                    })
                });
            }
        });
        this._companyTagService.isNoCompleted.subscribe(noComplete => {
            this.listPersonalDataTypes.forEach(type => {
                type.rowData.forEach(process => {
                    if (process.tagId === this.sharedTuple[0].tagId && type.tagId == this.sharedTuple[1].tagId) {
                        process.step3NoCompleted = noComplete;
                    }
                })
            });
        })
    }
}