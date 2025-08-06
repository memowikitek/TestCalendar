import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { EvaluationDetailComponent } from './evaluation-detail.component';

const PAGES = [EvaluationDetailComponent];

@NgModule({
  declarations: [PAGES],
  imports: [CommonModule, SharedModule]
})
export class EvaluationDetailModule { }
