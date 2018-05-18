import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalComponent } from './modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild()
    ],
    declarations: [
        ModalComponent
    ],
    exports: [
        ModalComponent
    ],
    providers: [
    ]
})

export class ModalModule {
}