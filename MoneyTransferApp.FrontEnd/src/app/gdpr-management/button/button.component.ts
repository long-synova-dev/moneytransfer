import { Component, OnInit, Input, Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../shared/services/alert.service';
import { PolicyService } from '../../shared/services/policy.service';

@Component({
    selector: 'my-input',
    template: `<input class="my-input" type="text" [name]="inputName" [value]="inputValue" (change)="onChange($event)">`
})
export class MyInput {
    @Input() inputValue:string;
    @Input() inputName:string;
    onChange(event) {
        this._data.updateshareContentEditor(event.target.name, event.target.value);
    }
    constructor(
        private _data: DataService
    ) {}
}
@Component({
    selector: 'my-textarea',
    template: `<textarea class="my-input" row="1" style="width:50%" [name]="inputName" (change)="onChange($event)">{{inputValue}}</textarea>`
})
export class MyTextarea {
    @Input() inputValue:string;
    @Input() inputName:string;
    onChange(event) {
        this._data.updateshareContentEditor(event.target.name, event.target.value);
    }
    constructor(
        private _data: DataService
    ) {}
}