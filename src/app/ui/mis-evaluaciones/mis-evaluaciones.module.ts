import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MisEvaluacionesComponent } from './mis-evaluaciones.component';
import { MisEvaluacionesRoutingModule } from './mis-evaluaciones-routing.module';

@NgModule({
  declarations: [MisEvaluacionesComponent],
  imports: [CommonModule, SharedModule, MisEvaluacionesRoutingModule]
})
export class MisEvaluacionesModule { }
