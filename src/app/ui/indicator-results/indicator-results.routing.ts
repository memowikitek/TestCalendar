import { Routes, RouterModule } from '@angular/router';
import { IndicatorResultsComponent } from './indicator-results.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: IndicatorResultsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorResultsRoutingModule {}
