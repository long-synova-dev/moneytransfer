import { Routes, RouterModule } from '@angular/router';

import { ManageComponent } from './manage.component';
import { EditCustomerComponent } from './customer/customer-edit.component';
import { CustomerManagement } from './customer/customer-management.component';

const manageRoutes: Routes = [
    {
        path: '',
        component: ManageComponent,
        children: [
            {
                path: '',
                redirectTo: 'customer',
                pathMatch: 'prefix'
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

export const ManageRouting = RouterModule.forChild(manageRoutes);