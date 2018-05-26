import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { EditCustomerComponent } from './customer/customer-edit.component';
import { CustomerManagement } from './customer/customer-management.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'customer',
                pathMatch: 'full'
            },
            {
                path: 'customer',
                component: CustomerManagement
            },
            {
                path: 'customer/new',
                component: EditCustomerComponent
            },
            {
                path: 'customer/edit/:customerId',
                component: EditCustomerComponent
            }
        ]
    }
];

export const HomeRouting = RouterModule.forChild(routes);