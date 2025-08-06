import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details-routing.module';
import { DetailsIndicatorComponent } from './details-indicator.component';
import { SharedModule } from 'src/app/shared';
import { NormativeRecordComponent } from './modals/normative-record/normative-record.component';
import { EvidencesRecordComponent } from './modals/evidences-record/evidences-record.component';
import { MisionRecordComponent } from './modals/mision-record/mision-record.component';
import { AreaResponsableComponent } from './modals/area-responsable/area-responsable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RubricaRecordComponent } from './modals/rubrica/rubrica-record.component';
import { NormativeIndicatorsControlComponent } from './indicator_controls/normative-indicators-control/normative-indicators-control.component';
import { EvidenceIndicatorsControlComponent } from './indicator_controls/evidence-indicators-control/evidence-indicators-control.component';
import { MiIndicatorsControlComponent } from './indicator_controls/mi-indicators-control/mi-indicators-control.component';
import { AreaRespIndicatorsControlComponent } from './indicator_controls/area-resp-indicators-control/area-resp-indicators-control.component';
import { RubricaIndicatorsControlComponent } from './indicator_controls/rubrica-indicators-control/rubrica-indicators-control.component';

//import { EditRecordsComponent } from './modals';
//import { EditRecordsComponent } from './modals/edit-records/edit-records.component';
import { QuillModule } from 'ngx-quill';

const PAGES = [DetailsIndicatorComponent];

@NgModule({
  declarations: [PAGES, NormativeRecordComponent, EvidencesRecordComponent, MisionRecordComponent, AreaResponsableComponent, RubricaRecordComponent, NormativeIndicatorsControlComponent, EvidenceIndicatorsControlComponent, MiIndicatorsControlComponent, AreaRespIndicatorsControlComponent, RubricaIndicatorsControlComponent],
  imports: [
    CommonModule,
    DetailsRoutingModule,
      SharedModule,
      ReactiveFormsModule,
      QuillModule.forRoot({ suppressGlobalRegisterWarning: true }),
  ],
  exports:[]
})
export class DetailsIndicatorModule { }

