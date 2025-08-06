import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { EvaluationCycleRoutingModule } from './evaluation-cycle-routing.module';
import { EvaluationCycleComponent } from './evaluation-cycle.component';
import { CyclesService } from 'src/app/core/services';
import { CycleRecordComponent } from './modals/cycle-record/cycle-record.component';

const PAGES = [EvaluationCycleComponent];
const SERVICES = [CyclesService];
const MODALS = [CycleRecordComponent];

@NgModule({
  declarations: [PAGES, MODALS],
  imports: [CommonModule, EvaluationCycleRoutingModule, SharedModule, MatSelectModule, ReactiveFormsModule],
  providers: [SERVICES, DatePipe]
})
export class EvaluationCycleModule { }
