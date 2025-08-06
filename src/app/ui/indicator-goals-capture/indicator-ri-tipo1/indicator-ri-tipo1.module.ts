import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { IndicatorRiTipo1RoutingModule } from './indicator-ri-tipo1-routing.module';
import { IndicatorRiTipo1Component } from './indicator-ri-tipo1.component';
import { IndicatorGoalParametersControlComponent } from './indicator-goal-parameters-control/indicator-goal-parameters-control.component';


@NgModule({
  declarations: [IndicatorRiTipo1Component,IndicatorGoalParametersControlComponent],
  imports: [CommonModule, IndicatorRiTipo1RoutingModule, SharedModule, ReactiveFormsModule, FormsModule
    ,QuillModule.forRoot({ suppressGlobalRegisterWarning: true })]
})
export class IndicatorRiTipo1Module { }
