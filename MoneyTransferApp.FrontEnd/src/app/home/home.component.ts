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
        this._userService.pingHome();
        let preferredLang = this._data.getDefaultLanguage();
        this._translate.setDefaultLang(preferredLang);
    }

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        let data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40];
        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
}