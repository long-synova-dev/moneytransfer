import { Routes, RouterModule } from '@angular/router';

import { BillingPlanComponent} from '../billing-plan/billing-plan.component';
import { SubscriptionComponent } from '../billing-plan/subscription.component';
import { SubscriptionHistoryComponent } from '../billing-plan/subscription-history.component';

const billingPlanRoutes: Routes = [
    {
        path: '',
        component: BillingPlanComponent,
        children: [
            {
                path: '',
                component: SubscriptionComponent
            },
            {
                path: 'history',
                component: SubscriptionHistoryComponent
            },
            {
                path: ':plan',
                component: SubscriptionComponent
            }
        ]
    }
];

export const BillingPlanRouting = RouterModule.forChild(billingPlanRoutes);