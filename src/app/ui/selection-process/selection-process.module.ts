import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { SelectionProcessComponent } from './selection-process.component';
import { SelectionProcessRoutingModule } from './selection-process-routing.module';

@NgModule({
  declarations: [SelectionProcessComponent],
  imports: [CommonModule, SharedModule, SelectionProcessRoutingModule]
})
export class SelectionProcessModule { }
