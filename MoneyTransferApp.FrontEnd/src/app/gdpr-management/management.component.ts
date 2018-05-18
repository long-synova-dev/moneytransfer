import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';

@Component({
    template: `
        <router-outlet></router-outlet>
    `
})

export class ManagementComponent implements OnInit {
    constructor(
        private _translate: TranslateService,
        private _data: DataService
    ) {}
    
    ngOnInit() {
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
    }
}