import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationCriteriaIrComponent } from './evaluation-criteria-ir.component';
import { SharedModule } from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { EvaluationCriteriaIrRoutingModule } from './evaluation-criteria-ir-routing.module';
import { CriteriaRecordComponent } from './modals/criteria-record/criteria-record.component';
import { CriteriaRecordService } from './modals/criteria-record/criteria-record.service';

const PAGES = [EvaluationCriteriaIrComponent];
const SERVICES = [CriteriaRecordService];
const MODALS = [CriteriaRecordComponent];

@NgModule({
  declarations: [PAGES, MODALS],
  imports: [
    CommonModule,
    EvaluationCriteriaIrRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    SERVICES,
    { provide: 'CicloEvaluacionData', useValue: {} }
  ],
})
export class EvaluationCriteriaIrModule { }
