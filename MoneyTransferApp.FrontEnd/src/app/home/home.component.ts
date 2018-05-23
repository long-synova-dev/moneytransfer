import { Component, OnInit } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { fadeTransition } from '../animations/fade-transition';
import { UserService } from '../shared/services/user.service';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeTransition()],
    host: {'[@fadeTransition]': ''}
})

export class HomeComponent implements OnInit {
    
    constructor(
        private _userService: UserService,
        private _data: DataService,
        private _translate: TranslateService
    ) { }

    ngOnInit() {
        //Load all customer data
    }

    
}