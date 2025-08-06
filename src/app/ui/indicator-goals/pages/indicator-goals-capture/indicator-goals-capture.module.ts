import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { IndicatorGoalsCaptureComponent } from './indicator-goals-capture.component';
import { IndicatorGoalsCaptureRoutingModule } from './indicator-goals-capture.routing';

@NgModule({
    declarations: [IndicatorGoalsCaptureComponent],
    imports: [CommonModule, IndicatorGoalsCaptureRoutingModule, SharedModule, ReactiveFormsModule],
    providers: [],
})
export class IndicatorGoalsCaptureModule {}
