import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { slideInOutTransition } from '../../../../animations/slide-transition';
import { tableColumnHighlightTransition } from '../../../../animations/table-column-highlight-transition';

import { CompanyTagService } from '../../../../shared/services/company-tag.service';
import { Globals } from '../../../../shared/global/global';
import { Tag } from '../../../../shared/models/tag.model';
import { TreePath } from '../../../../shared/models/tree-path.model';
import { DataService } from '../../../../shared/services/data.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { StepCancelComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    moduleId: module.id.toString(),
    templateUrl: './gdpr-data-analysis-step-2-ex.component.html',
    styleUrls: ['../../../gdpr.component.css'],
    animations: [slideInOutTransition(), tableColumnHighlightTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class GdprDataAnalysisStep2ExComponent implements OnInit {
    ready: boolean = false;
    source: Array<Tag>; //source = [Process, PersonGroup]
    question;
    questionAttribute;
    includeChildren: boolean = false;
    listCountries: Array<Tag>;
    countryState: string = 'valid';
    tuples: Array<Array<Tag>> = new Array<Array<Tag>>();

    constructor(
        private _router: Router,
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _matDialog: MatDialog
    ) { }

    ngOnInit() {
        this._companyTagService.getQuestionByCode(Globals.QUESTION_INCLUDE_CHILDREN)
            .then(response => {
                this.question = response;
                this.questionAttribute = "Question" + response.questionId;
            });
        this.source = this._companyTagService.getSharedTuple();
        if (!this.source) {
            this.source = new Array<Tag>();
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-2']);
            return;
        }

        this._data.changeLoadStatus(true);
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_COUNTRY, false)
            .then(data => {
                this.listCountries = data;
                this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId], Globals.CATEGORY_COUNTRY))
                    .then(data => {
                        this.tuples = data;

                        if (this.tuples.length > 0) {
                            this.listCountries.forEach(country => {
                                if (this.tuples.find(tuple => tuple[2].tagId === country.tagId)) {
                                    country.marked = true;
                                    country.fromTree = true;
                                }
                            });
                            if (this.tuples[0][1].rowData) {
                                let attr = this.tuples[0][1].rowData.find(r => r.name === this.questionAttribute);
                                if (attr != null) {
                                    this.includeChildren = attr.value === "true";
                                }
                            }
                        }
                        this._data.changeLoadStatus(false);
                        this.ready = true;
                    })
            });
    }

    select(country: Tag) {
        country.marked = true;
        let existedInTree = false;
        this.tuples.forEach(tuple => {
            if (tuple[2].tagId == country.tagId && tuple[2].fromTree) {
                tuple[2].deleting = false;
                existedInTree = true;
            }
        });
        if(!existedInTree) {
            let tuple = [...this.source, country];
            this.tuples.push(tuple);
        }

        // let tuple = [...this.source, country];
        // this.tuples.push(tuple);
    }

    unselect(country: Tag) {
        let existedInTree = false;
        this.tuples.forEach(tuple => {
            if (tuple[2].tagId == country.tagId && tuple[2].fromTree) {
                tuple[2].deleting = true;
                existedInTree = true;
            }
        });

        if (!existedInTree) {
            this.tuples = this.tuples.filter(tuple => tuple[2].tagId !== country.tagId);
        }

        this.listCountries.forEach(item => {
            if (item.tagId === country.tagId) {
                item.marked = false;
            }
        });
    }

    save() {
       if (!this._validate()) {
            this._translate.get('SecondStep.ValidationNoCountry').subscribe(value =>  this._alert.error(value));
            this.countryState = 'invalid';

            let timer = Observable.timer(2000).subscribe(() => {
                this.countryState = 'valid';
                timer.unsubscribe();
            });
            return;
       }
       this._data.changeLoadStatus(true);       
        let cloneSource = this.source.map(s => Object.assign({}, s));
        cloneSource[1].rowData = [{ name:  this.questionAttribute, value: this.includeChildren.toString() }];
        this.tuples.push(cloneSource);
        this._companyTagService.addTagToTree(this.tuples)
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value, null, true, true));
                }
                this._data.changeLoadStatus(false);                
                this._companyTagService.isStepSaved(true);
                this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-2']);
            });
    }

    private _validate() {
        if (this.tuples.filter(tuple => !tuple[2].deleting).length === 0) {
            return false;
        }
        return true;
    }

    back() {
        if (this._validate()) {
            return this.showPopUpConfirm();
       } else {
           this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-2']);
           this._companyTagService.isStepSaved(false);
       }
    }

    showPopUpConfirm() {
        let confirmDialog = this._matDialog.open(StepCancelComponent, {
            width: '400px'
        });
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-2']);
                this._companyTagService.isStepSaved(false);
            }
        })
    }
}