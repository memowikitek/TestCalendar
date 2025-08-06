import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsRoutingModule } from './indicators-routing.module';
import { SharedModule } from 'src/app/shared';
import { IndicatorsService } from 'src/app/core/services';
import { IndicatorsComponent } from './indicators.component';
//import { AuditRecordComponent,  } from './modals/audit-record/audit-record.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorsRecordComponent } from './modals/indicators-record/indicators-record.component';

const PAGES = [IndicatorsComponent];
const SERVICES = [IndicatorsService];


@NgModule({
  declarations: [PAGES, IndicatorsRecordComponent],
  imports: [CommonModule, IndicatorsRoutingModule, SharedModule,ReactiveFormsModule],
  providers: [SERVICES],
})
export class IndicatorsModule { }
