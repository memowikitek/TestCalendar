import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorGoalsHistoricComponent } from './indicator-goals-historic.component';

const routes: Routes = [{ path: '', component: IndicatorGoalsHistoricComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorGoalsHistoricRoutingModule {}
