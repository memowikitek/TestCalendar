import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorGoalsCaptureComponent } from './indicator-goals-capture.component';

const routes: Routes = [{ path: '', component: IndicatorGoalsCaptureComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorGoalsCaptureRoutingModule {}
