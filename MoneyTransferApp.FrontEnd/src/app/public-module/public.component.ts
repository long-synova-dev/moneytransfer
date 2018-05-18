import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    template: `
        <router-outlet></router-outlet>
    `
})

export class PublicComponent implements OnInit{
    constructor(
        private _translate: TranslateService,
    ) { }

    ngOnInit(): void {
        let preferredLang = "en-UK";
        this._translate.setDefaultLang(preferredLang);
    }
}