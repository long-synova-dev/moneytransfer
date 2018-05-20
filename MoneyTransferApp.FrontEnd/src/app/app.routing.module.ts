import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { AuthGuard, AuthGuardComponent } from './shared/guards/authenticator.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { PlanGuard } from './shared/guards/plan.guard';
import { IsCompleteWizardComponent } from './shared/guards/complete-wizard.guard';

import { NotFoundComponent } from './404.component';
import { NotHavePermissionComponent } from './403.component';
import { UserManageComponent } from './user-management/user-manage.component';
import { UserEditComponent } from './user-management/edit-user.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/gdpr/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '/gdpr/dashboard'
  },
  {
    path: 'account',
    loadChildren: './user/user.module#UserModule'
  }
];
 
export const AppRouting = RouterModule.forRoot(routes);