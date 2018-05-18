import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './dataprocessor-public.component.html'
})

export class DataprocessorPublicComponent {

    constructor(
        private _translate: TranslateService,
    ) { }

}