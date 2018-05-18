import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public.component';
import { DataprocessorPublicComponent } from './data-processor/dataprocessor-public.component';

const PublicRoutes: Routes = [
    {
        path: '',
        component: PublicComponent,
        children: [
            {
                path: 'dataprocessor',
                component: DataprocessorPublicComponent
            }
        ]
    }
];

export const PublicRouting = RouterModule.forChild(PublicRoutes);