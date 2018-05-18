import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Alert, AlertType } from '../models/alert.model';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = true;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = true;
                } else {
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, buttons: any[] = null, autoDismiss: boolean = true, keepAfterRouteChange = true) {
        this._alert(AlertType.Success, message, buttons, autoDismiss, keepAfterRouteChange);
    }

    error(message: string, buttons: any[] = null, autoDismiss: boolean = true, keepAfterRouteChange = true) {
        this._alert(AlertType.Error, message, buttons, autoDismiss, keepAfterRouteChange);
    }

    info(message: string, buttons: any[] = null, autoDismiss: boolean = true, keepAfterRouteChange = true) {
        this._alert(AlertType.Info, message, buttons, autoDismiss, keepAfterRouteChange);
    }

    warn(message: string, buttons: any[] = null, autoDismiss: boolean = true, keepAfterRouteChange = true) {
        this._alert(AlertType.Warning, message, buttons, autoDismiss, keepAfterRouteChange);
    }

    private _alert(type: AlertType, message: string, buttons: any[] = null, autoDismiss: boolean = true, keepAfterRouteChange = true) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{
            type: type, message: message, buttons: buttons, autoDismiss: autoDismiss
        });
    }

    clear() {
        this.subject.next();
    }
}