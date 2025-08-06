import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationsComponent } from './configurations.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationsComponent,
        //TODO: VALIDAR ROLES
        //canActivate: [RolesGuard],
        children: [
            {
                path: 'config-general',
                loadChildren: () =>
                    import('./pages/config-tabs/general-config.module').then((m) => m.GeneralConfigModule),
            },
            {
                path: 'carga-de-formatos',
                loadChildren: () =>
                    import('./pages/format-upload/format-upload.module').then((m) => m.FormatUploadModule),
            },
      
            { path: '**', redirectTo: '/Bienvenida' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConfigurationsRoutingModule {}
