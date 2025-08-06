import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationCriteriaIrComponent } from './evaluation-criteria-ir.component';

const routes: Routes = [{ path: '', component: EvaluationCriteriaIrComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EvaluationCriteriaIrRoutingModule {}