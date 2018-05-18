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
    templateUrl: './gdpr-data-analysis-step-3ba.component.html',
    styleUrls: ['../../../gdpr.component.css'],
    animations: [slideInOutTransition()],
    host: { '[@slideInOutTransition]': '' }
})

export class GdprDataAnalysisStep3BAComponent implements OnInit {
    ready: boolean = false;
    source: Array<Tag>; //source = [Process, PersonGroup, PersonalDataType, ITSystem]
    selectedDataSourceId: string;
    dataSourceName: string = "";
    exchangeDataName = new Array<string>();
    listDataSources: Array<any>;
    tuples: Array<Array<Tag>> = new Array<Array<Tag>>();
    listSuggestions: Array<IOption>;
    listSuggestionsOriginal: Array<IOption>;

    listSuggestionsForExchangeData: Array<IOption>;
    listSuggestionsForExchangeDataOriginal: Array<IOption>;
    listSuggestionsForExchangeDataTag: Array<Tag>;

    directFromPersonId = '51';
    thirdPartyId = '52';
    fromProfilingId = '54';


    dataClone: Object = {};

    constructor(
        private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _translate: TranslateService,
        private _alert: AlertService,
        private _matDialog: MatDialog
    ) { }

    ngOnInit() {
        this.source = this._companyTagService.getSharedTuple();
        if (!this.source) {
            this.source = new Array<Tag>();
            this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3']);
            return;
        }
        this._data.changeLoadStatus(true);
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_DATA_SOURCE, false)
            .then(data => {
                this.listDataSources = data;
                this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId, this.source[2].tagId, this.source[3].tagId], Globals.CATEGORY_DATA_SOURCE))
                    .then(data => {
                        this.tuples = data;
                        if (this.tuples.length > 0) {
                            this.tuples.forEach(tuple => {
                                let thisDataSource = this.listDataSources.find(tag => tag.tagId == tuple[4].tagId);
                                if (thisDataSource) {
                                    thisDataSource.marked = true;
                                    let exchangeDataCodes = [];
                                    let exchangeDataCodesOriginal = [];
                                    let attr = tuple[4].rowData.find(r => r.name === "DataSourceName");
                                    if (attr != null) {
                                        thisDataSource.dataSourceName = attr.value;
                                    }

                                    this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId, this.source[2].tagId, this.source[3].tagId, tuple[4].tagId], Globals.CATEGORY_EXCHANGEDATA))
                                        .then(exchangeDataTuples => {
                                            if (exchangeDataTuples) {
                                                exchangeDataTuples.forEach(exchangeDataTuple => {
                                                    exchangeDataCodes.push(exchangeDataTuple[5].tagId);
                                                    exchangeDataCodesOriginal.push(exchangeDataTuple[5].tagId);
                                                });
                                                thisDataSource.exchangeDataCodes = exchangeDataCodes;
                                                thisDataSource.exchangeDataCodesOriginal = exchangeDataCodesOriginal;
                                            }
                                        });
                                }
                            });

                            // this.selectedDataSourceId = this.tuples[0][4].tagId;
                            // this.dataClone['selectedDataSourceId'] = this.tuples[0][4].tagId;
                            // if (this.tuples[0][4].rowData) {
                            //     let attr = this.tuples[0][4].rowData.find(r => r.name === "DataSourceName");
                            //     if (attr != null) {
                            //         //console.log(attr);
                            //         let arr = attr.value.split(',');
                            //         this.dataSourceName = arr;
                            //         this.dataClone['dataSourceName'] = arr;
                            //     }
                            // }

                            // this._companyTagService.traverseTree(new TreePath([this.source[0].tagId, this.source[1].tagId, this.source[2].tagId, this.source[3].tagId, this.selectedDataSourceId], Globals.CATEGORY_EXCHANGEDATA))
                            //     .then(exchangeData => {
                            //         let tmp = [];
                            //         exchangeData.map(tuple => {
                            //             tmp.push(tuple[5].tagId);
                            //         });
                            //         this.exchangeDataName = tmp;
                            //         this.dataClone['exchangeDataName'] = tmp;
                            //     })
                        }

                        this.ready = true;
                        this._data.changeLoadStatus(false);
                    });
            });

        this._companyTagService.getSuggestionsForDataSources()
            .then(data => {
                this.listSuggestions = data;
                this.listSuggestionsOriginal = this.listSuggestions;
            });

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_EXCHANGEDATA, null)
            .then(data => {
                this.listSuggestionsForExchangeDataTag = data;
                this.listSuggestionsForExchangeData = data.map(item => {
                    return {
                        label: item.tagName,
                        value: item.tagId
                    }
                });

                this.listSuggestionsForExchangeDataOriginal = this.listSuggestionsForExchangeData;
            });
    }

    // select(dataSource: Tag) {
    //     if (this.selectedDataSourceId != this.thirdPartyId) {
    //         this.dataSourceName = '';
    //     }
    //     else if (this.selectedDataSourceId == this.fromProfilingId) {
    //         this.exchangeDataName = undefined;
    //     }

    //     let existedInTree = false;

    //     this.tuples.forEach(tuple => {
    //         if (tuple[4].tagId === dataSource.tagId && tuple[4].fromTree) {
    //             tuple[4].deleting = false;
    //             existedInTree = true;
    //         }
    //         if (tuple[4].tagId !== dataSource.tagId && tuple[4].fromTree) {
    //             tuple[4].deleting = true;
    //         }
    //     });

    //     if (!existedInTree) {
    //         let tuple = [...this.source, dataSource];
    //         this.tuples.push(tuple);
    //     }

    //     this.tuples = this.tuples.filter(tuple => tuple[4].tagId === dataSource.tagId || tuple[4].deleting);
    // }

    private _validate(showMessage) {
        let value = true;
        if (!this.listDataSources.find(d => d.marked)) {
            if (showMessage) this._translate.get('SecondStep.ValidationNoDataSource').subscribe(value => this._alert.error(value));
            return false;
        }

        this.listDataSources.forEach(dataSource => {
            if (dataSource.tagId != this.fromProfilingId && dataSource.marked && !dataSource.exchangeDataCodes) {
                if (showMessage) {
                    this._translate.get('SecondStep.ValidationNoEnoughData').subscribe(value => this._alert.error(value));
                    showMessage = false;
                }
                value = false;
            }
            if (dataSource.tagId == this.thirdPartyId && dataSource.marked && !dataSource.dataSourceName) {
                if (showMessage) this._translate.get('SecondStep.ValidationNoEnoughData').subscribe(value => this._alert.error(value));
                value = false;
            }
        });
        return value;
    }

    save() {
        //Validate
        if (!this._validate(true)) {
            return;
        }

        //Processing
        // console.log('source', this.source);
        // console.log('datasources', this.listDataSources);
        // console.log('tuples', this.tuples);
        let tuplesToSave = [];

        this.listDataSources.forEach(dataSource => {
            if (dataSource.marked) {
                if (dataSource.dataSourceName) {
                    dataSource.rowData = [{ "name": "DataSourceName", "value": dataSource.dataSourceName }];
                }

                let newTuple = [...this.source, dataSource];
                tuplesToSave.push(newTuple);

                if (dataSource.exchangeDataCodes) {
                    dataSource.exchangeDataCodes.forEach(exchangeDataCode => {
                        // let isNew = !dataSource.exchangeDataCodesOriginal || !dataSource.exchangeDataCodesOriginal.find(code => code == exchangeDataCode);
                        // if (isNew) {
                            let exchangeDataTag = this.listSuggestionsForExchangeDataTag.find(tag => tag.tagId == exchangeDataCode);
                            if (!exchangeDataTag) {
                                let thisCustomOption = this.listSuggestionsForExchangeData.find(item => item.value == exchangeDataCode);
                                if (thisCustomOption) {
                                    exchangeDataTag = new Tag(thisCustomOption.label, Globals.CATEGORY_EXCHANGEDATA, '', thisCustomOption.value);
                                }
                            }
                            let exchangeDataTuple = [...newTuple, exchangeDataTag];
                            tuplesToSave.push(exchangeDataTuple);
                        // }
                    });
                }

                if (dataSource.exchangeDataCodesOriginal) {
                    dataSource.exchangeDataCodesOriginal.forEach(exchangeDataCodeOriginal => {
                        let notDeleted = dataSource.exchangeDataCodes.find(code => code == exchangeDataCodeOriginal);
                        if (!notDeleted) {
                            let exchangeDataTag = this.listSuggestionsForExchangeDataTag.find(tag => tag.tagId == exchangeDataCodeOriginal);
                            if (exchangeDataTag) {
                                exchangeDataTag = JSON.parse(JSON.stringify(exchangeDataTag));
                                exchangeDataTag.deleting = true;
                                let exchangeDataTuple = [...newTuple, exchangeDataTag];
                                tuplesToSave.push(exchangeDataTuple);
                            }
                        }
                    });
                }

                // let existingBefore = this.tuples.find(tuple => tuple[4].tagId == dataSource.tagId);
                // if (existingBefore && existingBefore.) {
                //     existingBefore[4].
                // }
            } else {
                let existingBefore = this.tuples.find(tuple => tuple[4].tagId == dataSource.tagId);
                if (existingBefore) {
                    existingBefore[4].deleting = true;
                    tuplesToSave.push(existingBefore);
                }
            }
        });

        console.log('done tuples', tuplesToSave);

        // let tuple = this.tuples.find(t => !t[4].deleting);
        // let tuplesToSubmit = this.tuples;

        // if (!tuple[4].deleting) {
        //     tuple[4].rowData = [{ "name": "DataSourceName", "value": this.dataSourceName }];
        // }

        // if (this.exchangeDataName) {
        //     this.exchangeDataName.forEach(exchangeItem => {
        //         let thisExchangeTag = this.listSuggestionsForExchangeDataTag.find(tag => tag.tagId == exchangeItem);

        //         if (!thisExchangeTag) {
        //             let thisCustomTag = this.listSuggestionsForExchangeData.find(item => item.value == exchangeItem);
        //             if (thisCustomTag) {
        //                 thisExchangeTag = new Tag(thisCustomTag.label, Globals.CATEGORY_EXCHANGEDATA, '', thisCustomTag.value);
        //             }
        //         }

        //         let clonedTuple = JSON.parse(JSON.stringify(tuple));
        //         clonedTuple.push(thisExchangeTag);
        //         tuplesToSubmit.push(clonedTuple);
        //     });
        // }

        //Call backend
        this._data.changeLoadStatus(true);
        this._companyTagService.addTagToTree(tuplesToSave)
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
        if (!this._validate(false)) {
            return this.showConfirmPopUp();
        }
        // if (this.selectedDataSourceId == this.thirdPartyId && (!this.compareArray(this.dataClone['dataSourceName'], this.dataSourceName) || !this.compareArray(this.dataClone['exchangeDataName'], this.exchangeDataName))) {
        //     return this.showConfirmPopUp();
        // };
        // if (this.selectedDataSourceId == this.directFromPersonId && !this.compareArray(this.exchangeDataName, this.dataClone['exchangeDataName'])) {
        //     return this.showConfirmPopUp();
        // };
        // if (this.selectedDataSourceId != this.dataClone['selectedDataSourceId']) {
        //     return this.showConfirmPopUp();
        // };
        this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-3', '3b']);
        this._companyTagService.isStepSaved(false);
    }

    showConfirmPopUp() {
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
        this.dataSourceName = searchTerm;
    }

    onNoExchangeDataOptionsFound(searchTerm) {
        let obj = { label: searchTerm, value: new Date().getTime().toString() };
        this.listSuggestionsForExchangeData = [obj, ...this.listSuggestionsForExchangeDataOriginal];
        this.exchangeDataName = [];
        this.exchangeDataName.push(searchTerm);
    }

    compareArray(arr1, arr2) {
        if (arr1 && arr2) {
            if (arr1.length !== arr2.length)
                return false;
            for (var i = arr1.length; i--;) {
                if (arr1[i] !== arr2[i])
                    return false;
            }
            return true;
        }
    }
}