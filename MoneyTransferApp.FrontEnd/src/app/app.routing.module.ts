import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AuthGuardComponent } from './shared/guards/authenticator.guard';
import { RoleGuard } from './shared/guards/role.guard';

import { NotFoundComponent } from './404.component';
import { NotHavePermissionComponent } from './403.component';
import { UserManageComponent } from './user-management/user-manage.component';
import { UserEditComponent } from './user-management/edit-user.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './manage/manage.module#ManageModule'
  },
  {
    path: 'user-manage',
    loadChildren: './user-management/user-manage.module#UserManageModule',
    canActivate: [AuthGuardComponent, RoleGuard],
    data: {
      roles: ['R0']
    }
  },
  {
    path: 'account',
    loadChildren: './user/user.module#UserModule'
  }
];

export const AppRouting = RouterModule.forRoot(routes);