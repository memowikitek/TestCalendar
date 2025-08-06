import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationGenerationComponent } from './evaluation-generation.component';

const routes: Routes = [{ path: '', component: EvaluationGenerationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationGenerationRoutingModule { }
