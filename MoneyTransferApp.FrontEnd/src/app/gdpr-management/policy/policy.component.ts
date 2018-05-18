import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { PolicyService } from '../../shared/services/policy.service';

@Component({
    templateUrl: './policy.component.html',
    styleUrls: ['../management.component.css']
})

export class PolicyComponent implements OnInit {
    policies;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _policy: PolicyService,
        private _router: Router,
    ) {}
    
    ngOnInit() {
        this._policy.getAllPolicy()
            .then(response => {
                this.policies = response;
                console.log(response);
            })
    }
    viewDetail(policy) {
        this._router.navigate(['/gdpr/management/policy-management', policy])
    }
}