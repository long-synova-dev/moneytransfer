import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PublicComponent } from './public.component';
import { PublicRouting } from './public.routing';
import { DataprocessorPublicComponent } from './data-processor/dataprocessor-public.component';

@NgModule({
    imports: [
        CommonModule,
        PublicRouting,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            isolate: true
        }),
    ],
    declarations: [
        PublicComponent,
        DataprocessorPublicComponent
    ],
    providers: [
    ]
})

export class PublicModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-public.json");
}