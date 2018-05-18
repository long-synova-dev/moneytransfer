import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, Route} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DataService } from '../services/data.service';

@Injectable()
export class IsCompleteWizardComponent implements CanActivate {
    isComplete:boolean = true;
    constructor(
        private _router: Router,
        private _data: DataService
    ) {}

    canActivate() {
        this.isComplete = true;
        if (this.isComplete) {
            return true;
        }
        this._router.navigate(['/gdpr-wizard']);
        return false;
    }
}