import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorRiTipo1Component } from './indicator-ri-tipo1.component';

const routes: Routes = [{ path: '', component: IndicatorRiTipo1Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndicatorRiTipo1RoutingModule {}
