import { Routes, RouterModule } from '@angular/router';

import { ManagementComponent } from './management.component';
import { PolicyComponent } from './policy/policy.component';
import { DataprocessorComponent } from './dataprocessor/dataprocessor.component';
import { PolicyManagementComponent } from './policy/policy-management.component';
import { DataprocessorManagementComponent } from './dataprocessor/dataprocessor-management.component';
import { CounterpartComponent } from './dataprocessor/counterpart/counterpart.component';
import { RiskComponent } from './risk/risk.component';
import { RiskManagementComponent } from './risk/risk-management.component';
import { ProcessesComponent } from './processes/processes.component';
import { PersondataComponent } from './persondata/persondata.component';
import { JustificationComponent } from './persondata/justification/justification.component';
import { ThirdPartyCoutryTransferComponent } from './persondata/3rd-party-country-transfer/3rd-party-country-transfer.component';
import { ThirdPartyExComponent } from './persondata/3rd-party-country-transfer/ex/3rd-party-ex.component';

export const ManagementRoutes: Routes = [
    {
        path: '',
        component: ManagementComponent,
        children: [
            {
                path: 'policy',
                component: PolicyComponent
            },
            {
                path: 'policy-management/:id',
                component: PolicyManagementComponent
            },
            {
                path: 'dataprocessor',
                component: DataprocessorComponent,
            },
            {
                path: 'dataprocessor-management/:id',
                component: DataprocessorManagementComponent,
                children: [
                    {
                        path: 'counterpart',
                        component: CounterpartComponent
                    }
                ]
            },
            {
                path: 'risk',
                component: RiskComponent
            },
            {
                path: 'risk-management',
                component: RiskManagementComponent
            },
            {
                path: 'risk-management/:id',
                component: RiskManagementComponent
            },
            {
                path: 'processes',
                component: ProcessesComponent
            },
            {
                path: 'persondata',
                component: PersondataComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'justification'
                    },
                    {
                        path: 'justification',
                        component: JustificationComponent
                    },
                    {
                        path: '3rd-party-country-transfer',
                        component: ThirdPartyCoutryTransferComponent,
                        children: [
                            {
                                path: 'edit-vendor',
                                component: ThirdPartyExComponent
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export const ManagementRouting = RouterModule.forChild(ManagementRoutes);