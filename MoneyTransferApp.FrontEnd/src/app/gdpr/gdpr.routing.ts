import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AuthGuardComponent } from '../shared/guards/authenticator.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { PlanGuard } from '../shared/guards/plan.guard';

import { GdprComponent } from './gdpr.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const GdprRoutes: Routes = [
    {
        path: '',
        component: GdprComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'tasks',
                loadChildren: '../gdpr-tasks/tasks.module#TasksModule',
                canActivate: [AuthGuardComponent, RoleGuard, PlanGuard],
                data: {
                  roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
                  plans: ['trial', 'small', 'medium', 'large']
                }
            },
            {
                path: 'management',
                loadChildren: '../gdpr-management/management.module#ManagementModule',
                canActivate: [AuthGuardComponent, RoleGuard, PlanGuard],
                data: {
                  roles: ['R2', 'R3', 'R4', 'R5', 'R6'],
                  plans: ['trial', 'small', 'medium', 'large']
                }
            }
        ]
    }
];

export const GdprRouting = RouterModule.forChild(GdprRoutes);