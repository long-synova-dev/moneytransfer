import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';

@Component({
    templateUrl: './edit-it-system.component.html',
    styleUrls: ['../management.component.css']
})

export class EditITSystemComponent implements OnInit {
    policies;

    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
    ) {}
    
    ngOnInit() {
    }
}