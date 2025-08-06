import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalityRecordComponent } from './modals/modality-record/modality-record.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { ModalityRoutingModule } from './modality-routing.module';
import { ModalityComponent } from './modality.component';
import { ModalityRecordService } from './modals';

const PAGES = [ModalityComponent];

const MODALS = [ModalityRecordComponent];

const SERVICES = [ModalityRecordService];

@NgModule({
    declarations: [PAGES, MODALS],
    imports: [CommonModule, ModalityRoutingModule, SharedModule, ReactiveFormsModule],
    providers: [SERVICES],
})
export class ModalityModule {}
