import { Component, OnInit } from '@angular/core';

import { Alert, AlertType } from '../models/alert.model';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.css']
})

export class AlertComponent {
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }
            this.alerts.push(alert);

            if (alert.autoDismiss) {
                Observable.timer(4000).subscribe(t => this.removeAlert(alert));
            }
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}