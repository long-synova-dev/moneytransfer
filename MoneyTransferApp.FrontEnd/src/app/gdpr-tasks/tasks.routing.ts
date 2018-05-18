import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './tasks.component';
import { TasksManagementComponent } from './tasks-management/tasks-management.component';
import { PerformComponent } from './perform/perform.component';
import { ReviewComponent } from './review/review.component';

const TasksRoutes: Routes = [
    {
        path: '',
        component: TasksComponent,
        children: [
            {
                path: '',
                redirectTo: 'add'
            },
            {
                path: 'add',
                component: TasksManagementComponent
            },
            {
                path: 'edit/:id',
                component: TasksManagementComponent
            },
            {
                path: 'edit',
                redirectTo: 'add'
            },
            {
                path: 'perform',
                component: PerformComponent
            },
            {
                path: 'review',
                component: ReviewComponent
            }
        ]
    }
];

export const TasksRouting = RouterModule.forChild(TasksRoutes);