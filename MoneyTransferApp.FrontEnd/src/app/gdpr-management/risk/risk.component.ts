import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { RiskService } from '../../shared/services/risk.service';

@Component({
    templateUrl: './risk.component.html',
    styleUrls: ['../management.component.css']
})

export class RiskComponent implements OnInit {

    listRisks;
    isReady:boolean = false;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
        private _riskService: RiskService
    ) {}
    
    ngOnInit() {
        this._data.changeLoadStatus(true);
        this._riskService.getAllRisks()
            .then(response => {
                // console.log(response);
                this.listRisks = response;
                this.listRisks.forEach(riskItem => {
                    riskItem.taskNonSchedule = 0;
                    riskItem.isShowTask = false;
                    riskItem.tasks.forEach(task => {
                        // Status = 1 => New(Non-schedule)
                        if (task.taskStatus == 1) {
                            riskItem.taskNonSchedule = riskItem.taskNonSchedule + 1;
                        }
                    });
                });
                this.setStatusColor(this.listRisks);
                this.isReady = true;
                this._data.changeLoadStatus(false);
            })
    }

    toggleTask(risk) {
        risk.isShowTask = !risk.isShowTask;
    }

    setStatusColor(listRisks) {
        listRisks.forEach(item => {
            if (!item.riskLikelihood) {
                item.color = 'blue';
                return;
            }
            if (item.riskLikelihood + item.riskImpact <= 4) {
                item.color = 'green';
            } else {
                if (item.riskLikelihood + item.riskImpact < 9) {
                    item.color = 'yellow';
                } else {
                    item.color = 'red';
                }
            }
        });
    }

    addNew() {
        this._router.navigate(['gdpr', 'management', 'risk-management']);
    }

    goDetail(id) {
        this._router.navigate(['gdpr', 'management', 'risk-management', id]);
    }
}