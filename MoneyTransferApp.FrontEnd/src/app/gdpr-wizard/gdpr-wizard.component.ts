import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeTransition } from '../animations/fade-transition';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './gdpr-wizard.component.html',
    styleUrls: ['./gdpr.component.css'],
    animations: [fadeTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprWizardComponent implements OnInit {
    
    constructor(
        private _data: DataService,
        private _translate: TranslateService
    ) { }

    ngOnInit(): void {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
    }
}