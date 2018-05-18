import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../../shared/services/data.service';
import { PersonDataService } from '../../../shared/services/persondata.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
    templateUrl: './justification.component.html',
    styleUrls: ['../../management.component.css']
})

export class JustificationComponent implements OnInit {

    constructor(
        private _translate: TranslateService,
        public _data: DataService,
        private _router: Router,
        private _alert: AlertService,
        private _persondataService: PersonDataService
    ) { }

    allProcesses;
    selectedProcess;

    allPersonGroups;
    selectedPersonGroup;

    allPurposes;
    selectedPurpose;

    purposeModel = {
        deletionJustifications: [],
        purposeJustification: '',
        processTagId: 0,
        purposeTagId: 0,
        personTypeTagId: 0
    };

    ngOnInit() {
        this._data.changeLoadStatus(true);

        this._persondataService.getAllProcesses().then(data => {
            this.allProcesses = data;
            this.selectProcess(this.allProcesses[0]);
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
        this._persondataService.getAllPurposes(this.selectedProcess.value, this.selectedPersonGroup.value).then(data => {
            this.allPurposes = data;

            if (this.allPurposes[0]) {
                this.selectPurpose(this.allPurposes[0]);
            }

            this._data.changeLoadStatus(false);
        });
    }

    selectPurpose(purpose) {
        this.selectedPurpose = purpose;

        this.purposeModel = {
            deletionJustifications: this.selectedPurpose.dataTypes.map(dataType => {
                return {
                    dataTypeTagId: dataType.dataTypeId,
                    justification: dataType.deletionPolicyJustification
                }
            }),
            purposeJustification: this.selectedPurpose.purposeJustification,
            processTagId: this.selectedProcess.value,
            purposeTagId: this.selectedPurpose.purposeTagId,
            personTypeTagId: this.selectedPersonGroup.value
        };
    }

    savePurpose() {
        this._data.changeLoadStatus(true);
        this._persondataService.savePurpose(this.purposeModel).then(() => {
            this._translate.get('Persondata.SavedSuccessfully').subscribe(value => this._alert.success(value));

            this.selectedPurpose.purposeJustification = this.purposeModel.purposeJustification;
            this.selectedPurpose.dataTypes.forEach(dataType => {
                let model = this.purposeModel.deletionJustifications.find(m => m.dataTypeTagId == dataType.dataTypeId);

                if (model) {
                    dataType.deletionPolicyJustification = model.justification;
                }
            });
            this._data.changeLoadStatus(false);
            this.selectedPurpose = null
        })
    }

    changeTab($event) {
        console.log($event);
    }
}