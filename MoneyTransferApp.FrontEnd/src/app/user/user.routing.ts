import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { UserLoginComponent } from './login/user-login.component';
import { UserSignupComponent } from './signup/user-signup.component';
import { UserForgotPassComponent } from './forgot-pass/user-forgot-pass.component';
import { UserChangePassComponent } from './change-pass/user-change-pass.component';
import { UserConfirmSignUpComponent } from './confirm-signup/user-confirm-signup.component';
import { RoleGuard } from '../shared/guards/role.guard';
import { NotFoundComponent } from '../404.component';
import { NotHavePermissionComponent } from '../403.component';

const UserRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                redirectTo: 'login'
            },
            {
                path: 'login',
                component: UserLoginComponent
            },
            {
                path: 'signup',
                component: UserSignupComponent
            },
            {
                path: 'forgot-password',
                component: UserForgotPassComponent
            },
            {
                path: 'change-password',
                component: UserChangePassComponent
            },
            {
                path: 'confirm-signup',
                component: UserConfirmSignUpComponent
            },
            {
                path: 'not-found',
                component: NotFoundComponent
            },
            {
                path: 'forbidden',
                component: NotHavePermissionComponent
            }
        ]
    }
];

export const UserRouting = RouterModule.forChild(UserRoutes);