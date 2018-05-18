import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { RiskService } from '../../shared/services/risk.service';
import { UserService } from '../../shared/services/user.service';
import { Subject } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';

@Component({
    templateUrl: './risk-management.component.html',
    styleUrls: ['../management.component.css']
})

export class RiskManagementComponent implements OnInit {

    isReady:boolean = false;
    isAddNew:boolean = false;
    impact;
    likelihood;
    riskManagementForm: FormGroup;
    defineRiskOwner: Array<IOption>;
    listRiskTypeOptions: Array<IOption>;
    listRiskOrganizationOptions: Array<IOption>;
    riskDetailData;

    assessment = [
        {
            row: 1,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        },
        {
            row: 2,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        },
        {
            row: 3,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        },
        {
            row: 4,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        },
        {
            row: 5,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        },
        {
            row: 6,
            cols: [
                {id: 1, color: null, active: false},
                {id: 2, color: null, active: false},
                {id: 3, color: null, active: false},
                {id: 4, color: null, active: false},
                {id: 5, color: null, active: false},
                {id: 6, color: null, active: false}
            ]
        }
    ];

    listTasks = [
        {id: '1', name: 'Task 1', selected: false},
        {id: '2', name: 'Task 2', selected: false},
        {id: '3', name: 'Task 3', selected: false},
        {id: '4', name: 'Task 4', selected: false},
        {id: '5', name: 'Task 5', selected: false}
    ];

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _alert: AlertService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _riskService: RiskService,
        private _userService: UserService
    ) {}
    
    ngOnInit() {
        this._data.changeLoadStatus(true);
        let getAPIProcess = new Subject<object>();
        let detailAPI = getAPIProcess.asObservable();
        getAPIProcess.subscribe(response => {
            if (response['getAllRisksType'] 
                && response['getAllRisksOrganization'] 
                && response['getUsersInCompany']
                && response['getRiskDetail']) {
                this.formInit(this.riskDetailData);
                this._data.changeLoadStatus(false);
                this.isReady = true;
            } else {
                console.log('loading...');
            }
        });
        let updateGetAPIProcess = (data:object) => {
            let APIProcess = Object.assign(detailAPI, data);
            getAPIProcess.next(APIProcess);
        };

        this._riskService.getAllRisksType()
            .then(response => {
                this.listRiskTypeOptions = response;
                updateGetAPIProcess({'getAllRisksType': true});
            });
        this._riskService.getAllRisksOrganization()
            .then(response => {
                this.listRiskOrganizationOptions = response;
                updateGetAPIProcess({'getAllRisksOrganization': true});
            });
        this._userService.getUsersInCompany()
            .then(response => {
                let defineValue = response;
                defineValue.forEach(element => {
                    element.value = element.value.toLowerCase();
                });
                this.defineRiskOwner = defineValue;
                updateGetAPIProcess({'getUsersInCompany': true});
            })
        this._activatedRoute.params.subscribe(params=> {
            if(params.id) {
                // Edit risk
                this._riskService.getRiskDetail(params.id)
                    .then(response => {
                        this.riskDetailData = response;
                        this.riskDetailData.taskNonSchedule = 0;
                        this.riskDetailData.assosciatedTask.forEach(task => {
                            // Status = 1 => New(Non-schedule)
                            if (task.taskStatus == 1) {
                                this.riskDetailData.taskNonSchedule = this.riskDetailData.taskNonSchedule + 1;
                            }
                        });
                        updateGetAPIProcess({'getRiskDetail': true});
                    })
            } else {
                this.isAddNew = true;
                updateGetAPIProcess({'getRiskDetail': true});
            }
        });
    }
    formInit(data) {
        this.riskManagementForm = this._formBuilder.group({
            'riskName': [data && data.riskName ? data.riskName : null],
            'riskDescription': [data && data.riskDescription ? data.riskDescription : null],
            'riskLegel': [data && data.riskLegel ? data.riskLegel : null],
            'riskOwnerId': [data && data.riskOwnerId ? data.riskOwnerId : null],
            'riskResponsibleId': [data && data.riskResponsibleId ? data.riskResponsibleId : null],
            'riskType': [data && data.riskTypeValue ? data.riskTypeValue : null],
            'organizationLevel': [data && data.organizationLevelValue ? data.organizationLevelValue : null],
            'isPublished': [data && data.isPublished ? data.isPublished : null]
        });
        this.assessment.forEach(item => {
            item.cols.forEach(cell => {
                if (item.row + cell.id <= 4) {
                    cell.color = 'green';
                } else {
                    if (item.row + cell.id < 9) {
                        cell.color = 'yellow';
                    } else {
                        cell.color = 'red';
                    }
                }
            })
        })
        this.assessment = this.assessment.reverse();
        if (data && data.riskLikelihood && data.riskImpact) {
            this.clickRiskAssessment(data.riskImpact, data.riskLikelihood);
        };
    }
    selectTask(id) {
        let selectItem = this.listTasks.find(x => x.id == id);
        selectItem.selected = true;
    }
    unselectTask(id) {
        let selectItem = this.listTasks.find(x => x.id == id);
        selectItem.selected = false;
    }
    clickRiskAssessment(impact, likelihood) {
        this.impact = impact;
        this.likelihood = likelihood;
        let selectedRow = this.assessment.find(x => x.row == impact);
        let selectedCell = selectedRow.cols.find(x => x.id == likelihood);
        this.assessment.forEach(item => {
            item.cols.forEach(cell => {
                cell.active = false;
            })
        })
        selectedCell.active = true;
    }
    onSubmit(data) {
        this._data.changeLoadStatus(true);
        data.riskImpact = this.impact ? this.impact : null;
        data.riskLikelihood = this.likelihood ? this.likelihood : null;
        if (!this.isAddNew) {
            data.riskId = this.riskDetailData.riskId;
            this._riskService.updateRisk(data)
                .then(response => {
                    this._translate.get(`Management.SavedSuccessfully`).subscribe(s => {
                        this._alert.success(s);
                    });
                    this._router.navigate(['gdpr', 'management', 'risk']);
                    this._data.changeLoadStatus(false);
                });
        } else {
            this._riskService.addNewRisk(data)
                .then(response => {
                    this._translate.get(`Management.SavedSuccessfully`).subscribe(s => {
                        this._alert.success(s);
                    });
                    this._router.navigate(['gdpr', 'management', 'risk']);
                    this._data.changeLoadStatus(false);
                })
        }
    }
}