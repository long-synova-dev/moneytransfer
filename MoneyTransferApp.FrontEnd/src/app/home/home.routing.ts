import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const HomeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];

export const HomeRouting = RouterModule.forChild(HomeRoutes);