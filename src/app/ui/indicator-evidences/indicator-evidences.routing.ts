import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndicatorEvidencesComponent } from './indicator-evidences.component';

const routes: Routes = [{ path: '', component: IndicatorEvidencesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorEvidencesRoutingModule {}
