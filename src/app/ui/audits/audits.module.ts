import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditsRoutingModule } from './audits-routing.module';
import { SharedModule } from 'src/app/shared';
import { AuditService } from 'src/app/core/services';
import { AuditsComponent } from './audits.component';
import { AuditRecordComponent,  } from './modals/audit-record/audit-record.component';
import { ReactiveFormsModule } from '@angular/forms';


const PAGES = [AuditsComponent];
const MODALS = [AuditRecordComponent];
const SERVICES = [AuditService];

@NgModule({
  declarations: [PAGES, MODALS],
  imports: [CommonModule, AuditsRoutingModule, SharedModule,ReactiveFormsModule],
  providers: [SERVICES],

})
export class AuditsModule { }
