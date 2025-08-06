import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsComponent } from './indicators.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: IndicatorsComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsRoutingModule { }
