import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../../shared/services/data.service';
import { PersonDataService } from '../../../shared/services/persondata.service';
import { AlertService } from '../../../shared/services/alert.service';
import {MatSidenav} from '@angular/material/sidenav';
import { IOption } from 'ng-select';

@Component({
    templateUrl: './3rd-party-country-transfer.component.html',
    styleUrls: ['../../management.component.css']
})

export class ThirdPartyCoutryTransferComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MatSidenav;
    allProcesses;
    selectedProcess;

    allPersonGroups;
    selectedPersonGroup;

    allPurposes;
    selectedPurpose;

    listSuggestions: Array<IOption>;
    listSuggestionsOriginal: Array<IOption>;
    vendorCategory;
    NameOf3rdPartyVendor;

    constructor(
        private _translate: TranslateService,
        public _data: DataService,
        private _router: Router,
        private _alert: AlertService,
        private _persondataService: PersonDataService
    ) { }

    ngOnInit() {
        this._data.changeLoadStatus(true);
        this._persondataService.getShareVendorData.subscribe(data => {
            if (data) {
                this.allPurposes.forEach(element => {
                    let isVendor = element.vendorDataTypes.find(vendor => vendor.vendorId == data.vendorId);
                    if (isVendor) {
                        isVendor = data;
                    };
                });
            }
        });
        this._persondataService.getAllProcesses().then(data => {
            this.allProcesses = data;
            this.selectProcess(this.allProcesses[0]);
        });
        this._persondataService.getVendorCategories().then(data => {
            let listCategory: Array<IOption> = [];
            data.forEach(element => {
                let category = {
                    value: element,
                    label: element
                }
                listCategory.push(category);
            });
            this.listSuggestionsOriginal = listCategory;
            this.listSuggestions = listCategory;
        });
    }

    selectProcess(process) {
        this.allPurposes = undefined;
        this.selectedProcess = process;
        this._persondataService.getPersonGroupsByProcess(process.value).then(data => {
            this.allPersonGroups = data;
            this.selectPersonGroup(this.allPersonGroups[0]);
        });
    }

    selectPersonGroup(personGroup) {
        this.allPurposes = undefined;
        this.selectedPersonGroup = personGroup;
        this._persondataService.getAllPurposesOf3rdParty(this.selectedProcess.value, this.selectedPersonGroup.value).then(data => {
            this.allPurposes = data;
            if (this.allPurposes[0]) {
                this.selectPurpose(this.allPurposes[0]);
            }
            this._data.changeLoadStatus(false);
        });
    }

    selectPurpose(purpose) {
        this.selectedPurpose = purpose;
    }

    clickMatrix(purpose, vendorId, dataTypesId) {
        let selectedDataType = purpose.vendorDataTypes.find(vendor => vendor.vendorId == vendorId).dataTypes.find(item => item.id == dataTypesId);
        selectedDataType.selected = !selectedDataType.selected
    }

    onNoOptionsFound(searchTerm) {
        this.listSuggestions = [{ label: searchTerm, value: searchTerm }, ...this.listSuggestionsOriginal];
        this.vendorCategory = searchTerm;
    }

    addVendor(purpose) {
        this._data.changeLoadStatus(true);
        let vendorModel = {
            purposeId: purpose.purposeId,
            vendorName:this.NameOf3rdPartyVendor,
            vendorCategory: this.vendorCategory
        }
        this._persondataService.addNewVendor(vendorModel)
            .then(response => {
                let dataTypes = purpose.dataTypes;
                dataTypes.forEach(element => {
                    response.dataTypes = [];
                    response.dataTypes.push(element);
                });
                this.allPurposes.find(item => item.purposeId == purpose.purposeId).vendorDataTypes.push(response);
                this.NameOf3rdPartyVendor = null;
                this.vendorCategory = null;
                this._data.changeLoadStatus(false);
            })
    }
    savePurpose(purpose) {
        this._data.changeLoadStatus(true);
        this._persondataService.saveVendorsOnPurpose(purpose)
            .then(response => {
                if(response && response.error) {
                    this._translate.get(`Persondata.${response.error}`).subscribe(data => this._alert.error(data));
                } else {
                    this._alert.success('Success');
                }
                this.selectedPurpose = null;
                this._data.changeLoadStatus(false);
            })
    }
    deleteVendor(purpose, vendorId) {
        this._data.changeLoadStatus(true);
        this._persondataService.deleteVendor(vendorId)
            .then(response => {
                if (response && response.error) {
                    this._alert.error(response.error);
                } else {
                    this._alert.success('Success');
                    let currentPurpose = this.allPurposes.find(item => item.purposeId == purpose.purposeId);
                    console.log(purpose,currentPurpose);
                    currentPurpose.vendorDataTypes = currentPurpose.vendorDataTypes.filter(vendor => vendor.vendorId !== vendorId);
                }
                this._data.changeLoadStatus(false);
            });
    }
    vendorView(vendor) {
        this._persondataService.setSharedVendorData(vendor);
        this._router.navigate(['gdpr', 'management', 'persondata', '3rd-party-country-transfer', 'edit-vendor'])
    }
}