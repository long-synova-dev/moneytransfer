import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { slideInOutTransition } from '../../../../animations/slide-transition';
import { CompanyTagService } from '../../../../shared/services/company-tag.service';
import { Globals } from '../../../../shared/global/global';
import { Tag } from '../../../../shared/models/tag.model';
import { TreePath } from '../../../../shared/models/tree-path.model';
import { DataService } from '../../../../shared/services/data.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { IOption } from 'ng-select';
import { StepCancelComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    moduleId: module.id.toString(),
    templateUrl: './gdpr-data-analysis-step-3bb.component.html',
    styleUrls: ['../../../gdpr.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class GdprDataAnalysisStep3BBComponent implements OnInit {
    constructor(
        private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _matDialog: MatDialog
    ) { }

    ready1: boolean = false;
    ready2: boolean = false;
    source: Array<Tag>; //source = [Process, PersonGroup, PersonalDataType, Purpose]
    listDataOwners: Array<Tag>;
    listDeletionPeriods: Array<Tag>;
    tuples1: Array<Array<Tag>> = new Array<Array<Tag>>();
    tuples2: Array<Array<Tag>> = new Array<Array<Tag>>();
    selectedDataOwnerId: string;
    selectedDeletionPeriodId: string;

    dataOwnerName: string = "";
    deletionPeriodName: string = "";

    listSuggestions: Array<IOption>;
    listSuggestionsOriginal: Array<IOption>;
    listTransferOfData: Array<IOption>;
    
    outSourceId = '56';
    transferOfData:string = "";
    dataClone: Object = {};
    alert:boolean = true;

    ngOnInit() {
        this.source = this._companyTagService.getSharedTuple();
        if (!this.source) {
            this.source = new Array<Tag>();
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
            return;
        }
        this._data.changeLoadStatus(true);
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_DATA_OWNER, false)
            .then(data => {
                this.listDataOwners = data;
                this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId, this.source[2].tagId, this.source[3].tagId], Globals.CATEGORY_DATA_OWNER))
                    .then(data => {
                        this.tuples1 = data;
                        if (this.tuples1.length > 0) {
                            this.selectedDataOwnerId = this.tuples1[0][4].tagId;
                            this.dataClone['selectedDataOwnerId'] = this.tuples1[0][4].tagId;
                            if (this.tuples1[0][4].rowData) {
                                let attr = this.tuples1[0][4].rowData.find(r => r.name === "DataOwnerName");
                                if (attr != null) {
                                    this.dataOwnerName = attr.value;
                                }

                                let attr2 = this.tuples1[0][4].rowData.find(r => r.name === "TransferOfData");
                                if (attr2 != null) {
                                    this.transferOfData = attr2.value;
                                    this.dataClone['transferOfData'] = attr2.value;
                                }
                            }
                        }
                        this.ready1 = true;
                        this._data.changeLoadStatus(false);
                    });
            });

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_DELETION_OF_DATA, null)
            .then(data => {
                this.listDeletionPeriods = data;
                this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId, this.source[2].tagId, this.source[3].tagId], Globals.CATEGORY_DELETION_OF_DATA))
                    .then(data => {
                        this.tuples2 = data;
                        if (this.tuples2.length > 0) {
                            this.selectedDeletionPeriodId = this.tuples2[0][4].tagId;
                            this.dataClone['selectedDeletionPeriodId'] = this.tuples2[0][4].tagId;
                        }
                        this.ready2 = true;
                        this._data.changeLoadStatus(false);
                    });
            });

        this._companyTagService.getSuggestionsForDataOwners()
            .then(data => {
                this.listSuggestions = data;
                this.listSuggestionsOriginal = this.listSuggestions;
            });

            this._companyTagService.getTagsByCategory(Globals.CATEGORY_TRANSFER_OF_DATA, false)
            .then(data => {
                this.listTransferOfData = data.map(d => {
                    return {
                        value: d.tagId,
                        label: d.tagName
                    }
                });
            })
    }

    select(tag: Tag, tuples: Array<Array<Tag>>) {
        let existedInTree = false;

        tuples.forEach(tuple => {
            if (tuple[4].tagId === tag.tagId && tuple[4].fromTree) {
                tuple[4].deleting = false;
                existedInTree = true;
            }
            if (tuple[4].tagId !== tag.tagId && tuple[4].fromTree) {
                tuple[4].deleting = true;
            }
        });

        if (!existedInTree) {
            let tuple = [...this.source, tag];
            tuples.push(tuple);
        }

        return tuples.filter(tuple => tuple[4].tagId === tag.tagId || tuple[4].deleting);
    }

    selectOwner(owner: Tag) {
        if (this.selectedDataOwnerId == this.outSourceId) {
            this.dataOwnerName = '';
        }
        this.tuples1 = this.select(owner, this.tuples1);
    }

    selectDeletion(deletion: Tag) {
        this.tuples2 = this.select(deletion, this.tuples2);
        this.deletionPeriodName = null;
    }

    editCustomDeletionPeriod() {
        if (this.deletionPeriodName) {
            this.tuples2.forEach(tuple => {
                if (tuple[4].fromTree) {
                    tuple[4].deleting = true;
                }
            });

            this.tuples2 = this.tuples2.filter(tuple => tuple[4].deleting);
            let newTag = new Tag(this.deletionPeriodName, Globals.CATEGORY_DELETION_OF_DATA);
            this.tuples2.push([...this.source, newTag]);
        }
    }

    save() {
        if (!this.selectedDataOwnerId) {
            this._translate.get('SecondStep.ValidationNoDataOwner').subscribe(value => this._alert.error(value));
            return;
        }
        if(!this.transferOfData) {
            this._translate.get('SecondStep.ValidationNoTransferOfData').subscribe(value => this._alert.error(value));
            return;
        }
        if (!this.selectedDeletionPeriodId && !this.deletionPeriodName) {
            this._translate.get('SecondStep.ValidationNoDeletionPeriod').subscribe(value => this._alert.error(value));
            return;
        }
        this._data.changeLoadStatus(true);
        this.tuples1.forEach(tuple => {
            if (!tuple[4].deleting) {
                tuple[4].rowData = [{
                    "name": "DataOwnerName",
                    "value": this.dataOwnerName
                }, {
                    "name": "TransferOfData",
                    "value": this.transferOfData
                }]
            }
        });

        this._companyTagService.addTagToTree([...this.tuples1, ...this.tuples2])
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value, null, true, true));
                    this._companyTagService.isStepSaved(true);
                    this._data.changeLoadStatus(false);
                    this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3', '3b']);
                };
            });
    }

    back() {
        if (this.selectedDataOwnerId != this.dataClone['selectedDataOwnerId'] ||
        this.transferOfData != this.dataClone['transferOfData'] ||
        this.selectedDeletionPeriodId != this.dataClone['selectedDeletionPeriodId']) {
            this.showConfirmPopUp();
        } else {
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3', '3b']);
            this._companyTagService.isStepSaved(false);
        }
    }

    showConfirmPopUp(){
        let confirmDialog = this._matDialog.open(StepCancelComponent, {
            width: '400px'
        });
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3', '3b']);
                this._companyTagService.isStepSaved(false);
            }
        })
    }

    onNoOptionsFound(searchTerm) {
        this.listSuggestions = [{ label: searchTerm, value: searchTerm }, ...this.listSuggestionsOriginal];
        this.dataOwnerName = searchTerm;
    }
}