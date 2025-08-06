import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisEvaluacionesComponent } from './mis-evaluaciones.component';

const routes: Routes = [{ 
    path: '', 
    component: MisEvaluacionesComponent,
    children: [
        {
          path: 'ciclo-etapas',
          loadChildren: () => import('./pages/selection-stages/selection-stages.module').then((m) => m.SelectionStagesModule),
        },
    ] 
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MisEvaluacionesRoutingModule {}
