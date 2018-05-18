import { Routes, RouterModule } from '@angular/router';

import { GdprWizardComponent } from './gdpr-wizard.component';
import { GdprStartedComponent } from './started/gdpr-started.component';
import { GdprFirstStepComponent } from './first-step/gdpr-first-step.component';
import { GdprDataAnalysisComponent } from './data-analysis/data-analysis.component';
import { GdprDataAnalysisStep1Component } from './data-analysis/step-1/gdpr-data-analysis-step-1.component';
import { GdprDataAnalysisStep2Component } from './data-analysis/step-2/gdpr-data-analysis-step-2.component';
import { GdprDataAnalysisStep2ExComponent } from './data-analysis/step-2/ex-step/gdpr-data-analysis-step-2-ex.component';
import { GdprDataAnalysisStep3Component } from './data-analysis/step-3/gdpr-data-analysis-step-3.component';
import { GdprDataAnalysisStep3BComponent } from './data-analysis/step-3/step-b/gdpr-data-analysis-step-3b.component';
import { GdprDataAnalysisStep3BAComponent } from './data-analysis/step-3/step-ba/gdpr-data-analysis-step-3ba.component';
import { GdprDataAnalysisStep3BBComponent } from './data-analysis/step-3/step-bb/gdpr-data-analysis-step-3bb.component';
import { DataProcessingComponent } from './data-processing/data-processing.component';
import { DataProcessingExComponent } from './data-processing/ex/data-processing-ex.component';
import { AuthGuard, AuthGuardComponent } from '../shared/guards/authenticator.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { PlanGuard } from '../shared/guards/plan.guard';

const GdprWizardRoutes: Routes = [
    {
        path: '',
        component: GdprWizardComponent,
        children: [
            {
                path: '',
                redirectTo: 'getstarted'
            },
            {
                path: 'getstarted',
                component: GdprStartedComponent,
            },
            {
                path: 'first-step',
                component: GdprFirstStepComponent,
            },
            {
                path: 'data-analysis',
                component: GdprDataAnalysisComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'step-1'
                    },
                    {
                        path: 'step-1',
                        component: GdprDataAnalysisStep1Component,
                    },
                    {
                        path: 'step-2',
                        component: GdprDataAnalysisStep2Component,
                        children: [
                            {
                                path: 'ex',
                                component: GdprDataAnalysisStep2ExComponent
                            }
                        ]
                    },
                    {
                        path: 'step-3',
                        component: GdprDataAnalysisStep3Component,
                        children: [
                            {
                                path: '3b',
                                component: GdprDataAnalysisStep3BComponent,
                                children: [
                                    {
                                        path: '3ba',
                                        component: GdprDataAnalysisStep3BAComponent
                                    },
                                    {
                                        path: '3bb',
                                        component: GdprDataAnalysisStep3BBComponent
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'data-processing',
                component: DataProcessingComponent,
                children: [
                    {
                        path: 'ex',
                        component: DataProcessingExComponent
                    }
                ]
            }
        ]
    }
];

export const GdprWizardRouting = RouterModule.forChild(GdprWizardRoutes);