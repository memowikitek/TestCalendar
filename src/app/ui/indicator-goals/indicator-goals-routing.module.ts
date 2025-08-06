import { NgModule } from '@angular/core';
import { IndicatorGoalsComponent } from './indicator-goals.component';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from 'src/app/shared/guards';

const routes: Routes = [
    {
        path: '',
        component: IndicatorGoalsComponent,
        //TODO: VALIDAR ROLES
        //canActivate: [RolesGuard],
        children: [
            {
                path: 'captura',
                loadChildren: () =>
                    import('./pages/indicator-goals-capture/indicator-goals-capture.module').then(
                        (m) => m.IndicatorGoalsCaptureModule
                    ),
            },
            {
                path: 'historico',
                loadChildren: () =>
                    import('./pages/indicator-goals-historic/indicator-goals-historic.module').then(
                        (m) => m.IndicatorGoalsHistoricModule
                    ),
            },
            { path: '**', redirectTo: '/Bienvenida' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorGoalsRoutingModule {}
