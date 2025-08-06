import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { IndicatorGoalsHistoricComponent } from './indicator-goals-historic.component';
import { IndicatorGoalsHistoricRoutingModule } from './indicator-goals-historic.routing';

@NgModule({
    declarations: [IndicatorGoalsHistoricComponent],
    imports: [CommonModule, IndicatorGoalsHistoricRoutingModule, SharedModule, ReactiveFormsModule],
    // providers: [SERVICES],
})
export class IndicatorGoalsHistoricModule {}
