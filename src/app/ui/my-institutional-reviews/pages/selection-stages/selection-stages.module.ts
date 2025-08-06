import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { SelectionStagesComponent } from './selection-stages.component';
import { SelectionStagesRoutingModule } from './selection-stages-routing.module';

@NgModule({
  declarations: [SelectionStagesComponent],
  imports: [CommonModule, SharedModule, SelectionStagesRoutingModule]
})
export class SelectionStagesModule { }
