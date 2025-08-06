import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationCycleComponent } from './evaluation-cycle.component';

const routes: Routes = [{
  path: '',
  component: EvaluationCycleComponent,
  children: [
    {
      path: 'generador',
      loadChildren: () => import('./pages/evaluation-generator/evaluation-generator.module').then((m) => m.EvaluationGeneratorModule),
    },
    {
      path: 'detalles',
      loadChildren: () => import('./pages/evaluation-detail/evaluation-detail.module').then((m) => m.EvaluationDetailModule),
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationCycleRoutingModule { }
