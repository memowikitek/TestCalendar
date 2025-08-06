import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorResultsComponent } from './indicator-results.component';
import { IndicatorResultsRoutingModule } from './indicator-results.routing';
import { SharedModule } from 'src/app/shared';

@NgModule({
    imports: [CommonModule, IndicatorResultsRoutingModule, SharedModule],
    declarations: [IndicatorResultsComponent],
})
export class IndicatorResultsModule {}
