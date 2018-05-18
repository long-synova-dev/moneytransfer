import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { AuthGuard, AuthGuardComponent } from './shared/guards/authenticator.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { PlanGuard } from './shared/guards/plan.guard';
import { IsCompleteWizardComponent } from './shared/guards/complete-wizard.guard';

import { BillingPlanComponent } from './billing-plan/billing-plan.component';
import { ProFeatureComponent } from './pro-feature/pro-feature.component';
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
  },
  {
    path: 'user-manage',
    loadChildren: './user-management/user-manage.module#UserManageModule',
    canActivate: [AuthGuardComponent, RoleGuard, PlanGuard, IsCompleteWizardComponent],
    data: {
      roles: ['R2','R3'],
      plans: ['trial', 'small', 'medium', 'large']
    }
  },
  {
    path: 'account-owner',
    component: UserSettingComponent,
    canActivate: [AuthGuardComponent, RoleGuard, PlanGuard, IsCompleteWizardComponent],
    data: {
      roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
      plans: ['trial', 'small', 'medium', 'large']
    }
  },
  {
    path: 'gdpr',
    loadChildren: './gdpr/gdpr.module#GdprModule',
    canActivate: [AuthGuardComponent, RoleGuard, PlanGuard, IsCompleteWizardComponent],
    data: {
      roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
      plans: ['trial', 'small', 'medium', 'large']
    }
  },
  {
    path: 'gdpr-wizard',
    loadChildren: './gdpr-wizard/gdpr-wizard.module#GdprWizardModule',
    canActivate: [AuthGuardComponent, RoleGuard, PlanGuard],
    data: {
      roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
      plans: ['trial', 'small', 'medium', 'large']
    }
  },
  {
    path: 'billing-plan',
    loadChildren: './billing-plan/billing-plan.module#BillingPlanModule',
    canActivate: [AuthGuardComponent, RoleGuard],
    data: {
      roles: ['R2', 'R3', 'R4', 'R5', 'R6']
    }
  },
  {
    path: 'pro-feature',
    component: ProFeatureComponent,
    canActivate: [AuthGuardComponent, RoleGuard, PlanGuard],
    data: {
      roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
      plans: ['medium', 'large']
    }
  },
  {
    path: '**',
    redirectTo: '/gdpr/dashboard'
  }
];
 
export const AppRouting = RouterModule.forRoot(routes);