import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../animations/fade-transition';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'billing-plan',
    template: `<router-outlet></router-outlet>`,
    animations: [fadeTransition()],
    host: {'[@fadeTransition]': ''}
})
export class BillingPlanComponent  implements OnInit {
    constructor(
        private _data: DataService,
        private _translate: TranslateService
    ) { }

    ngOnInit(): void {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
    }
}