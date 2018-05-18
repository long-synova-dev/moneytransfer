import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { UserComponent } from './user.component';
import { UserLoginComponent } from './login/user-login.component';
import { UserSignupComponent } from './signup/user-signup.component';
import { UserForgotPassComponent } from './forgot-pass/user-forgot-pass.component';
import { UserChangePassComponent } from './change-pass/user-change-pass.component';
import { UserConfirmSignUpComponent } from './confirm-signup/user-confirm-signup.component';

import { ModalModule } from '../shared/directives/modal.module';
import { UserRouting } from './user.routing';
import { UserService } from '../shared/services/user.service';
import { CommonService } from '../shared/services/common.service';
import { SelectModule } from 'ng-select';
import { NotFoundComponent } from '../404.component';
import { NotHavePermissionComponent } from '../403.component';

@NgModule({
    imports: [
        CommonModule,
        UserRouting,
        FormsModule,
        ModalModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            isolate: true
        }),
        SelectModule
    ],
    declarations: [
        UserComponent,
        UserLoginComponent,
        UserSignupComponent,
        UserForgotPassComponent,
        UserChangePassComponent,
        UserConfirmSignUpComponent,
        NotFoundComponent,
        NotHavePermissionComponent
    ],
    providers: [
       // UserService,
        CommonService
    ]
})

export class UserModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/i18n/", "-user.json");
}