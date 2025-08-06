import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from 'src/app/shared/guards';
import { RolesGuard } from 'src/app/shared/guards/roles/roles.guard';
import { SyncGuardHelper } from 'src/app/shared/guards/sync-guard-helper/sync-guard-helper.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        // canActivate: [SyncGuardHelper],
        data: {
            syncGuards: [AppGuard, RolesGuard],
        },
        children: [
            {
                path: 'mi-perfil',
                loadChildren: () => import('src/app/ui/my-profile/my-profile.module').then((m) => m.MyProfileModule),
            },
            {
                path: 'componentes',
                loadChildren: () => import('src/app/ui/componentes/componentes.module').then((m) => m.ComponentesModule),
            },
            {
                path: 'proceso-evaluacion',
                loadChildren: () => import('src/app/ui/audits/audits.module').then((m) => m.AuditsModule),
            },
            {
                path: 'welcome-screen',
                loadChildren: () =>
                    import('src/app/ui/welcome-screen/welcome-screen.module').then((m) => m.WelcomeScreenModule),
            },
            {
                path: 'welcome-settings',
                loadChildren: () =>
                    import('src/app/ui/welcome-settings/welcome-settings-record.module').then(
                        (m) => m.WelcomeSettingsRecordModule
                    ),
            },
            {
                path: 'catalogos',
                loadChildren: () => import('src/app/ui/catalogs/catalogs.module').then((m) => m.CatalogsModule),
            },
            {
                path: 'seguridad',
                loadChildren: () => import('src/app/ui/seguridad/seguridad.module').then((m) => m.SeguridadModule),
            },
            {
                path: 'configuracion',
                loadChildren: () =>
                    import('src/app/ui/configurations/configurations.module').then((m) => m.ConfigurationsModule),
            },            
            {
                path: 'metas-indicador',
                loadChildren: () =>
                    import('src/app/ui/indicator-goals/indicator-goals.module').then((m) => m.IndicatorGoalsModule),
            },
            {
                path: 'evidencias-indicador',
                loadChildren: () =>
                    import('src/app/ui/indicator-evidences/indicator-evidences.module').then(
                        (m) => m.IndicatorEvidencesModule
                    ),
            },
            {
                path: 'resultados-indicador',
                loadChildren: () =>
                    import('src/app/ui/indicator-results/indicator-results.module').then(
                        (m) => m.IndicatorResultsModule
                    ),
            },
            {
                path: 'ejecucion-autoevaluacion',
                loadChildren: () =>
                    import('src/app/ui/self-assessment-execution/self-assessment-execution.module').then(
                        (m) => m.SelfAssessmentExecutionModule
                    ),
            },
            {
                path: 'plan-mejora',
                loadChildren: () =>
                    import('src/app/ui/improvement-plan/improvement-plan.module').then((m) => m.ImprovementPlanModule),
            },
            {
                path: 'revision-autoevaluacion',
                loadChildren: () =>
                    import('src/app/ui/self-assessment-review/self-assessment-review.module').then(
                        (m) => m.SelfAssessmentReviewModule
                    ),
            },
            {
                path: 'auditoria',
                loadChildren: () => import('src/app/ui/audit/audit.module').then((m) => m.AuditModule),
            },
            {
                path: 'indicadores',
                loadChildren: () => import('src/app/ui/indicators/indicators.module').then((m) => m.IndicatorsModule),
            },
            {
                path: 'detalles-indicadores',
                loadChildren: () => import('src/app/ui/detail_indicator/details-indicator.module').then((m) => m.DetailsIndicatorModule),
            },
            {
                path: 'detalles-indicadores-ce',
                loadChildren: () => import('src/app/ui/detail_indicator_ce/details-indicator.module').then((m) => m.DetailsIndicatorModule),
            },
            {
                path: 'ciclo-evaluacion',
                loadChildren: () => import('src/app/ui/evaluation-cycle/evaluation-cycle.module').then((m) => m.EvaluationCycleModule),
            },
            {
                path: 'operacion',
                loadChildren: () => import('src/app/ui/operations/operations.module').then((m) => m.OperationsModule),
            },
            {
                path: 'reportes',
                loadChildren: () => import('src/app/ui/reports/reports.module').then((m) => m.ReportsModule),
                data: {
                    syncGuards: [AppGuard, RolesGuard],
                },
            },
            {
                path: 'reporte-seguimiento',
                loadChildren: () =>
                    import('src/app/ui/reports-and-monitoring/reports-and-monitoring.module').then(
                        (m) => m.ReportsAndMonitoringModule
                    ),
            },
            {
                path: 'evaluation-generation',
                loadChildren: () => import('src/app/ui/evaluation-generation/evaluation-generation.module').then((m) => m.EvaluationGenerationModule),
            },
            {
                path: 'indicator-goals-capture',
                loadChildren: () => import('src/app/ui/indicator-goals-capture/indicator-goals-capture.module').then((m) => m.IndicatorGoalsCaptureModule),
            },
            {
                path: 'role-selection',
                loadChildren: () => import('src/app/ui/rol-selection/rol-selection.module').then((m) => m.RolSelectionScreenModule),
            },
            {
                path: 'mis-evaluaciones',
                loadChildren: () => import('src/app/ui/mis-evaluaciones/mis-evaluaciones.module').then((m) => m.MisEvaluacionesModule),
            },
            {
                path: 'informe-rev-inst',
                loadChildren: () => import('src/app/ui/informe-rev-inst/informe-rev-inst.module').then((m) => m.InformeRevInstModule),
            },
            {
                path: 'seleccion-proceso',
                loadChildren: () => import('src/app/ui/selection-process/selection-process.module').then((m) => m.SelectionProcessModule),
            },
            {
                path: 'welcome-cycle',
                loadChildren: () => import('src/app/ui/new-welcome/new-welcome.module').then((m) => m.NewWelcomeModule),
            },
            {
                path: 'my-notifications',
                loadChildren: () => import('src/app/ui/my-notifications/my-notifications.module').then((m) => m.MyNotificationsModule),
            },
            {
                path: 'notifications-settings',
                loadChildren: () => import('src/app/ui/my-notifications-settings/my-notifications-settings.module').then((m) => m.MyNotificationsSettingsModule),
            },
            {
                path: 'notifications-tracking',
                loadChildren: () => import('src/app/ui/my-notifications-tracking/my-notifications-tracking.module').then((m) => m.MyNotificationsTrackingModule),
            },
            {
                path: 'criterios-ri',
                loadChildren: () => import('src/app/ui/catalogs/pages/evaluation-criteria-ir/evaluation-criteria-ir.module').then((m) => m.EvaluationCriteriaIrModule),
            },
            {
                path: 'mis-revisiones-institucionales',
                loadChildren: () => import('src/app/ui/my-institutional-reviews/my-institutional-reviews.module').then((m) => m.MyInstitutionalReviewsModule),
            },
            {
                path: 'mis-revisiones-institucionales/indicador-ri-tipo1',
                loadChildren: () => import('src/app/ui/indicator-goals-capture/indicator-ri-tipo1/indicator-ri-tipo1.module').then((m) => m.IndicatorRiTipo1Module),
            },

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
