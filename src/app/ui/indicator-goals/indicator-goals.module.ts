import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { IndicatorGoalsComponent } from './indicator-goals.component';
import { IndicatorGoalsRoutingModule } from './indicator-goals-routing.module';

@NgModule({
    declarations: [IndicatorGoalsComponent],
    imports: [CommonModule, IndicatorGoalsRoutingModule, SharedModule],
})
export class IndicatorGoalsModule {}
