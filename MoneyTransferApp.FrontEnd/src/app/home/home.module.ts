import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeComponent } from './home.component';
import { HomeRouting } from './home.routing';


@NgModule({
    imports: [
        CommonModule,
        HomeRouting,
        ChartsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    declarations: [
        HomeComponent
    ],
    providers: [
    ]
})

export class HomeModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-home.json");
}