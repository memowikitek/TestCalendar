import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { EvaluationGeneratorComponent } from './evaluation-generator.component';

const PAGES = [EvaluationGeneratorComponent];
//const SERVICES = [CyclesService];
//const MODALS = [CycleRecordComponent];

@NgModule({
  declarations: [PAGES],
  imports: [CommonModule, SharedModule]
})
export class EvaluationGeneratorModule { }
