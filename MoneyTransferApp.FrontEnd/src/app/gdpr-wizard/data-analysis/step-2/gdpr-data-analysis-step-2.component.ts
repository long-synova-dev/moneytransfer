import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../../../animations/fade-transition';
import { tableAddRowTransition } from '../../../animations/table-add-transition';
import { tableColumnHighlightTransition } from '../../../animations/table-column-highlight-transition';
import { IOption } from 'ng-select';

import { CompanyTagService } from '../../../shared/services/company-tag.service';
import { Globals } from '../../../shared/global/global';
import { Tag } from '../../../shared/models/tag.model';
import { TreePath } from '../../../shared/models/tree-path.model';
import { DataService } from '../../../shared/services/data.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './gdpr-data-analysis-step-2.component.html',
    styleUrls: ['../../gdpr.component.css'],
    animations: [fadeTransition(), tableAddRowTransition(), tableColumnHighlightTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprDataAnalysisStep2Component implements OnInit {
    ready: boolean = false;
    listSelectedProcesses: Array<Tag>;
    listPersonGroups: Array<Tag>;
    customCategory: string;
    tuples: Array<Array<Tag>> = new Array<Array<Tag>>();
    sharedTuple: Array<Tag>;
    sharedTupleMarkedInTree: boolean;

    constructor(
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _alert: AlertService,
        private _router: Router,
        private _translate: TranslateService,
        private _activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_PERSON_GROUP, null)
            .then(data => {
                this.listPersonGroups = data;
                this._companyTagService.getTagsByCategory(Globals.CATEGORY_PROCESS, true)
                    .then(data => {
                        this.listSelectedProcesses = data;
                        if (this.listSelectedProcesses.length === 0) {
                            this._translate.get('SecondStep.ValidationNoProcess').subscribe(value => this._alert.error(value, null, true, true));
                            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-1']);
                            return;
                        }

                        this._companyTagService.traverseTree(new TreePath([""], Globals.CATEGORY_PERSON_GROUP))
                            .then(data => {
                                this.tuples = data;

                                this.listPersonGroups.forEach(group => {
                                    group.rowData = this.listSelectedProcesses.map(pro => Object.assign({}, pro));

                                    group.rowData.forEach(process => {
                                        if (this.tuples.find(tuple => tuple[0].tagId == process.tagId && tuple[1].tagId == group.tagId)) {
                                            group.fromTree = true;
                                            process.marked = true;
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

    click(personGroup: Tag, process: Tag, event) {
        if (process.marked) {
            event.target.parentElement.classList.toggle("show-edit");
        } else {
            process.marked = true;
            let existed = false;
            this.tuples.forEach(tuple => {
                if (tuple[0].tagId === process.tagId && tuple[1].tagId == personGroup.tagId) {
                    existed = true;
                    tuple[1].deleting = false;
                }
            });

            if (!existed) {
                this.tuples.push(new Array<Tag>(process, personGroup));
            }
            this.sharedTuple = new Array<Tag>(process, personGroup);
            this.sharedTupleMarkedInTree = false;
            this._companyTagService.setSharedTuple(this.sharedTuple);
            this._router.navigate(['ex'], { relativeTo: this._activatedRoute });
        }
    }

    uncheck(personGroup: Tag, process: Tag, event) {
        //Update tuple
        let existedInTree = false;
        this.tuples.forEach(tuple => {
            if (tuple[0].tagId === process.tagId && tuple[1].tagId === personGroup.tagId && tuple[1].fromTree) {
                tuple[1].deleting = true;
                existedInTree = true;
            }
        });

        if (!existedInTree) {
            this.tuples = this.tuples.filter(tuple => tuple[0].tagId !== process.tagId && tuple[1].tagId !== personGroup.tagId);
        }

        //Save
        this.save(false);

        //Update UI
        process.marked = false;
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
    }

    edit(personGroup: Tag, process: Tag, event) {
        event.target.parentElement.parentElement.parentElement.classList.remove("show-edit");
        this.sharedTuple = new Array<Tag>(process, personGroup);
        this.sharedTupleMarkedInTree = true;
        this._companyTagService.setSharedTuple(this.sharedTuple);
        this._router.navigate(['ex'], { relativeTo: this._activatedRoute });
    }

    addCustomCategory() {
        if (this.customCategory) {
            let newTag = new Tag(this.customCategory, Globals.CATEGORY_PERSON_GROUP);
            newTag.rowData = this.listSelectedProcesses.map(pro => Object.assign({}, pro));

            this.listPersonGroups.push(newTag);
            this.customCategory = null;
            console.log(this.listPersonGroups);
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
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value));
                    this._data.changeLoadStatus(false);
                    if (cont) {
                        this._companyTagService.isStepSaved(true);
                        this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
                    }
                };
            });
    }

    saveAndProceed(cont: boolean) {
        if (cont && !this._validate()) {
            return;
        }
        this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value));
        this._data.changeLoadStatus(false);
        if (cont) {
            this._companyTagService.isStepSaved(true);
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
        } else {
            this._router.navigate(['gdpr-wizard', 'getstarted']);
        }
    }

    private _validate() {
        let valid = true;
        this.listSelectedProcesses.forEach(process => {
            if (!this.listPersonGroups.find(group =>
                group.rowData.find(innerProcess => innerProcess.tagId == process.tagId && innerProcess.marked))) {
                valid = false;
                process.validateState = 'invalid';
                this.listPersonGroups.forEach(group => {
                    group.rowData.forEach(innerProcess => {
                        if (innerProcess.tagId == process.tagId) {
                            innerProcess.validateState = 'invalid';
                        }
                    })
                })
            }
        });

        let timer = Observable.timer(2000).subscribe(() => {
            this.listSelectedProcesses.forEach(process => process.validateState = 'valid');
            this.listPersonGroups.forEach(group => {
                group.rowData.forEach(innerProcess => {
                    innerProcess.validateState = "valid";
                });
            });
            timer.unsubscribe();
        });

        if (!valid) {
            this._translate.get('SecondStep.ValidationNoPersonGroup').subscribe(value => this._alert.error(value));
        }

        return valid;
    }

    private _unselectIfUserClickBackInInner() {
        this._companyTagService.isSaved.subscribe(saved => {
            if (!saved && this.sharedTuple && this.sharedTuple[0] && this.sharedTuple[1]) {
                this.listPersonGroups.forEach(group => {
                    group.rowData.forEach(process => {
                        if (process.tagId === this.sharedTuple[0].tagId && group.tagId == this.sharedTuple[1].tagId) {
                            process.marked = this.sharedTupleMarkedInTree;
                        }
                    })
                });
            }
        });
    }
}