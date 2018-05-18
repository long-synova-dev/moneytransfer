import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IOption } from 'ng-select';
import { slideInOutTransition } from '../../../../animations/slide-transition';
import { tableAddRowTransition } from '../../../../animations/table-add-transition';
import { tableColumnHighlightTransition } from '../../../../animations/table-column-highlight-transition';

import { CompanyTagService } from '../../../../shared/services/company-tag.service';
import { Globals } from '../../../../shared/global/global';
import { Tag } from '../../../../shared/models/tag.model';
import { TreePath } from '../../../../shared/models/tree-path.model';
import { DataService } from '../../../../shared/services/data.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { StepCancelComponent2 } from '../../../confirm-dialog/confirm-dialog-2.component';
import { MatDialog } from '@angular/material';

@Component({
    moduleId: module.id.toString(),
    templateUrl: './gdpr-data-analysis-step-3b.component.html',
    styleUrls: ['../../../gdpr.component.css'],
    animations: [slideInOutTransition(), tableAddRowTransition(), tableColumnHighlightTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class GdprDataAnalysisStep3BComponent implements OnInit {
    ready1: boolean = false;
    ready2: boolean = false;
    source: Array<Tag>; //source = [Process, PersonalDataType]
    listPersonGroups: Array<Tag>;
    listItSystems: Array<Tag>;
    listPurposes: Array<Tag>;
    tuples1: Array<Array<Tag>> = new Array<Array<Tag>>();
    tuples2: Array<Array<Tag>> = new Array<Array<Tag>>();
    table1State: string = 'valid';
    table2State: string = 'valid';
    sharedTuple: Array<Tag>;
    sharedTupleMarkedInTree: boolean;
    customPurpose: string;
    customPurposeReasonId: string;

    definePurposes: Array<IOption> = [
        { label: '', value: '' },
        { label: 'Legal Reason', value: '1111' },
        { label: 'Business Reason', value: '2222' },
        { label: 'No Reason', value: '3333' }
    ];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _matDialog: MatDialog
    ) { }

    ngOnInit() {
        this.source = this._companyTagService.getSharedTuple();
        console.log("source", this.source);
        if (!this.source) {
            this.source = new Array<Tag>();
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
            return;
        }
        this._data.changeLoadStatus(true);

        this._companyTagService.getTypesByCategory(Globals.CATEGORY_PURPOSE)
            .then(data => this.definePurposes = data);

        this._companyTagService.traverseTree(new TreePath([this.source[0].tagId], Globals.CATEGORY_PERSON_GROUP))
            .then(data => {
                this.listPersonGroups = data.map(tuple => {
                    tuple[1].fromTree = false;
                    return tuple[1];
                })

                this._companyTagService.getTagsByCategory(Globals.CATEGORY_IT_SYSTEM, true)
                    .then(data => {
                        this.listItSystems = data;
                        this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, "", this.source[1].tagId], Globals.CATEGORY_IT_SYSTEM))
                            .then(data => {
                                this.tuples1 = data;
                                this.listPersonGroups.forEach(group => {
                                    group.rowData = this.listItSystems.map(pro => Object.assign({}, pro));
                                    group.rowData.forEach(it => {
                                        if (this.tuples1.find(tuple => tuple[1].tagId === group.tagId && tuple[3].tagId === it.tagId)) {
                                            it.marked = true;
                                            it.fromTree = true;
                                        }
                                    });
                                    this.ready1 = true;
                                    this._data.changeLoadStatus(false);
                                });
                            });
                    });
                this._companyTagService.getTagsByCategory(Globals.CATEGORY_PURPOSE, null)
                    .then(data => {
                        this.listPurposes = data;
                        this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, "", this.source[1].tagId], Globals.CATEGORY_PURPOSE))
                            .then(data => {
                                this.tuples2 = data;
                                this.listPurposes.forEach(purpose => {
                                    purpose.rowData = this.listPersonGroups.map(pro => Object.assign({}, pro));
                                    purpose.rowData.forEach(group => {
                                        if (this.tuples2.find(tuple => tuple[1].tagId === group.tagId && tuple[3].tagId === purpose.tagId)) {
                                            group.marked = true;
                                            group.fromTree = true;
                                        }
                                    });
                                    this.ready2 = true;
                                    this._data.changeLoadStatus(false);
                                });
                            });
                    });
            });

        this._unselectIfUserClickBackInInner();
    }

    clickTable1(personGroup: Tag, itSystem: Tag, event) {
        if (itSystem.marked) {
            event.target.parentElement.classList.toggle("show-edit");
        } else {
            itSystem.marked = true;

            //Process tuple
            let tuple = new Array<Tag>(this.source[0], personGroup, this.source[1], itSystem);
            let existedInTree = false;
            this.sharedTuple = tuple;
            this.sharedTupleMarkedInTree = false;
            this.tuples1.forEach(tuple => {
                if (tuple[1].tagId === personGroup.tagId && tuple[3].tagId === itSystem.tagId) {
                    tuple[3].deleting = false;
                }
            });
            if (!existedInTree) {
                this.tuples1.push(tuple);
            }

            this._companyTagService.setSharedTuple(tuple);
            this._router.navigate(['3ba'], { relativeTo: this._activatedRoute });
        }
        console.log(this.tuples1);
    }

    clickTable2(purpose: Tag, personGroup: Tag, event) {
        if (personGroup.marked) {
            event.target.parentElement.classList.toggle("show-edit");
        } else {
            personGroup.marked = true;

            //Process tuple
            let tuple = new Array<Tag>(this.source[0], personGroup, this.source[1], purpose);
            let existedInTree = false;
            this.sharedTuple = tuple;
            this.sharedTupleMarkedInTree = false;
            this.tuples2.forEach(tuple => {
                if (tuple[1].tagId === personGroup.tagId && tuple[3].tagId === purpose.tagId) {
                    tuple[3].deleting = false;
                }
            });
            if (!existedInTree) {
                this.tuples2.push(tuple);
            }

            this._companyTagService.setSharedTuple(tuple);
            this._router.navigate(['3bb'], { relativeTo: this._activatedRoute });
        }
    }

    editTable1(personGroup: Tag, itSystem: Tag, event) {
        let tuple = new Array<Tag>(this.source[0], personGroup, this.source[1], itSystem);
        this.sharedTuple = tuple;
        this.sharedTupleMarkedInTree = true;
        this._companyTagService.setSharedTuple(tuple);
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
        this._router.navigate(['3ba'], { relativeTo: this._activatedRoute });
    }

    editTable2(purpose: Tag, personGroup: Tag, event) {
        let tuple = new Array<Tag>(this.source[0], personGroup, this.source[1], purpose);
        this.sharedTuple = tuple;
        this.sharedTupleMarkedInTree = true;
        this._companyTagService.setSharedTuple(tuple);
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
        this._router.navigate(['3bb'], { relativeTo: this._activatedRoute });
    }

    uncheckTable1(personGroup: Tag, itSystem: Tag, event) {
        //Process tuple
        this.tuples1.forEach(tuple => {
            if (tuple[1].tagId === personGroup.tagId && tuple[3].tagId === itSystem.tagId) {
                tuple[3].deleting = true;
            }
        });

        //Save
        this.save(false);

        //Update UI
        itSystem.marked = false;
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
    }

    uncheckTable2(purpose: Tag, personGroup: Tag, event) {
        console.log(this.tuples2);
        //Process tuple
        this.tuples2.forEach(tuple => {
            if (tuple[1].tagId === personGroup.tagId && tuple[3].tagId === purpose.tagId) {
                tuple[3].deleting = true;
            }
        });

        //Save
        this.save(false);

        //Update UI
        personGroup.marked = false;
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
        console.log(this.tuples2);
    }

    addCustomPurpose() {
        if (this.customPurpose && this.customPurposeReasonId) {
            let newTag = new Tag(this.customPurpose, Globals.CATEGORY_PURPOSE, this.customPurposeReasonId);
            newTag.rowData = this.listPersonGroups.map(pro => Object.assign({}, pro));
            this.listPurposes.push(newTag);
            this.customPurpose = null;
            this.customPurposeReasonId = null;
        }
    }

    save(cont: boolean) {
        if (cont && !this._validate(true)) {
            return false;
        }
        this._data.changeLoadStatus(true);
        this._companyTagService.addTagToTree([...this.tuples1, ...this.tuples2])
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value, null, true, true));
                    this._data.changeLoadStatus(false);
                    if (cont) {
                        this._companyTagService.updateStep3Status(this.source[0].tagId, this.source[1].tagId, false)
                            .then(response => {
                                this._data.changeLoadStatus(false);
                            })
                        this._companyTagService.isStepSaved(true);
                        this._companyTagService.isStepNoCompleted(false);
                        this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
                    }
                };
            });
    }

    private _validate(isDisplayMessage: boolean) {
        let result = true;
        // check if is there any marked in "Type of person" and "IT system"
        let table1Marked = this.listPersonGroups.filter(group => group.rowData.find(it => it.marked));
        let table2Marked = this.listPurposes.filter(pur => pur.rowData.find(pro => pro.marked));

        if (table1Marked.length == 0) {
            this.table1State = 'invalid';
            if (isDisplayMessage) {
                this._translate.get('SecondStep.ValidationNoCategoryAndIT').subscribe(value => this._alert.error(value));
            }
            result = false;
        }

        if (table2Marked.length == 0) {
            this.table2State = 'invalid';
            if (isDisplayMessage) {
                this._translate.get('SecondStep.ValidationNoPurpose').subscribe(value => this._alert.error(value));
            }
            result = false;
        }

        //with each "Type of person - IT system" was marked, make sure at least one relative "Purpose" was marked also
        if (result)
        {
            for(let entry of table1Marked)
            {
                if(!this.listPurposes.find(pur => pur.rowData.find(pro => pro.tagName == entry.tagName && pro.marked)))
                {
                    this.table2State = 'invalid';
                    if (isDisplayMessage) {
                        this._translate.get('SecondStep.ValidationDataNotRelated').subscribe(value => this._alert.error(value));
                    }
                    result = false;
                    break;
                }
            }
        }

        //with each "Purpose - Type of person" was marked, make sure at least one relative "IT system" was marked also
        if(result)
        {
            for(let entry of table2Marked)
            {
                let listPersonTypeMarked = entry.rowData.filter(s => s.marked);
                for(let personType of listPersonTypeMarked)
                {
                    if(!this.listPersonGroups.find(s => s.tagName == personType.tagName && s.rowData.find(it => it.marked)))
                    {
                        this.table1State = 'invalid';
                        if (isDisplayMessage) {
                            this._translate.get('SecondStep.ValidationDataNotRelated').subscribe(value => this._alert.error(value));
                        }
                        result = false;
                        break;
                    }
                }
            }
        }
        console.log("list person groups: ",this.listPersonGroups);
        console.log("list purposes: ", this.listPurposes);

        let timer = Observable.timer(2000).subscribe(() => {
            this.table1State = 'valid';
            this.table2State = 'valid';
            timer.unsubscribe();
        });

        return result;
    }

    back() {
        let isValid = this._validate(false);

        if ((this.table1State != "invalid" || this.table2State != "invalid") && !isValid) {
            let confirmDialog = this._matDialog.open(StepCancelComponent2, {
                width: '400px'
            });
            confirmDialog.afterClosed().subscribe(result => {
                if (result) {
                    // Call API Update status
                    this._data.changeLoadStatus(true);
                    this._companyTagService.updateStep3Status(this.source[0].tagId, this.source[1].tagId, true)
                        .then(response => {
                            this._data.changeLoadStatus(false);
                        })
                    this._companyTagService.isStepSaved(true);
                    this._companyTagService.isStepNoCompleted(true);
                    this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
                }
            })
            
        }
        // If form is valid. Set the isStepSaved to true, then go back.
        else {
            this._data.changeLoadStatus(true);
            this._companyTagService.updateStep3Status(this.source[0].tagId, this.source[1].tagId, false)
                .then(response => {
                    this._data.changeLoadStatus(false);
                })
            this._companyTagService.isStepNoCompleted(false);
            this._companyTagService.isStepSaved(false);
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
        }
    }

    private _unselectIfUserClickBackInInner() {
        this._companyTagService.isSaved.subscribe(saved => {
            if (!saved && this.sharedTuple && this.sharedTuple[1] && this.sharedTuple[3]) {
                this.listPersonGroups.forEach(group => {
                    group.rowData.forEach(it => {
                        if (it.tagId === this.sharedTuple[3].tagId && group.tagId == this.sharedTuple[1].tagId) {
                            it.marked = this.sharedTupleMarkedInTree;
                        }
                    })
                });

                this.listPurposes.forEach(purpose => {
                    purpose.rowData.forEach(group => {
                        if (group.tagId === this.sharedTuple[1].tagId && purpose.tagId == this.sharedTuple[3].tagId) {
                            group.marked = this.sharedTupleMarkedInTree;
                        }
                    })
                });
            }
        });
    }
}