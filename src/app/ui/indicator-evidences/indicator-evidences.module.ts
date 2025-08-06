import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorEvidencesComponent } from './indicator-evidences.component';
import { SharedModule } from 'src/app/shared';
import { IndicatorEvidencesRoutingModule } from './indicator-evidences.routing';

@NgModule({
    declarations: [IndicatorEvidencesComponent],
    imports: [CommonModule, IndicatorEvidencesRoutingModule, SharedModule],
})
export class IndicatorEvidencesModule {}
