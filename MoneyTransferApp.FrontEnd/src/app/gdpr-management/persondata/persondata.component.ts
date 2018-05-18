import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';

@Component({
    templateUrl: './persondata.component.html',
    styleUrls: ['../management.component.css']
})

export class PersondataComponent implements OnInit, AfterViewInit {

    constructor(
        private _translate: TranslateService,
        public _data: DataService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private changeDetectionRef: ChangeDetectorRef
    ) { }

    private rlaSafe: boolean = false;

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.rlaSafe = true;
        this.changeDetectionRef.detectChanges();
    }
}