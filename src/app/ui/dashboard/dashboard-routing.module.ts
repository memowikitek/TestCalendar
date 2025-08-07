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
                path: 'inicio',
                loadComponent: () => import('src/app/ui/inicio/inicio.component')
            },
            {
                path: 'welcome',
                loadComponent: () => import('src/app/ui/welcome-new/welcome-new.component')
            },
            {
                path: 'catalogos',
                loadChildren: () => import('src/app/ui/catalogs/catalogs.module').then((m) => m.CatalogsModule),
            },
            {
                path: 'mi-perfil',
                loadComponent: () => import('src/app/ui/my-profile/my-profile.component')
                //loadComponent: () => import('src/app/ui/my-profile/my-profile.component').then((m) => m.MyProfileComponent),
            },
            {
                path: 'seguridad',
                loadChildren: () => import('src/app/ui/seguridad/seguridad.module').then((m) => m.SeguridadModule),
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
                path: 'componentes',
                loadComponent: () => import('src/app/ui/componentes/componentes.component')
            },
            {
                path: 'calendario',
                loadComponent: () => import('src/app/ui/calendario/calendario.component')
            },
            /*{
                path: 'seleccion-proceso',
                loadChildren: () => import('src/app/ui/selection-process/selection-process.module').then((m) => m.SelectionProcessModule),
            },*/
            /*{
                path: 'configuracion',
                loadChildren: () =>
                    import('src/app/ui/configurations/configurations.module').then((m) => m.ConfigurationsModule),
            },*/
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
