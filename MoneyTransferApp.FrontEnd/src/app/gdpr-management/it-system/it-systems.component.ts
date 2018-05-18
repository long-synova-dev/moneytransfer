import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { IOption } from 'ng-select';

@Component({
    templateUrl: './it-systems.component.html',
    styleUrls: ['../management.component.css']
})

export class ITSystemsComponent implements OnInit {

    listSuggestions: Array<IOption>;
    listSuggestionsOriginal: Array<IOption>;
    selectedITSystem;
    
    constructor(
        private _translate: TranslateService,
        private _data: DataService,
        private _router: Router,
    ) {}
    
    ngOnInit() {
    }

    onNoOptionsFound(searchTerm) {
        this.listSuggestions = [{ label: searchTerm, value: searchTerm }, ...this.listSuggestionsOriginal];
        this.selectedITSystem = searchTerm;
    }

}