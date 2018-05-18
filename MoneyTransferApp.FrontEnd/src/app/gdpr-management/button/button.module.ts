import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyInput, MyTextarea } from './button.component';
import { PolicyService } from '../../shared/services/policy.service';

@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [
        MyInput,
        MyTextarea
    ],
    providers: [
        PolicyService
    ],
    exports: [
        MyInput,
        MyTextarea
    ]
})
export class ButtonModule { }