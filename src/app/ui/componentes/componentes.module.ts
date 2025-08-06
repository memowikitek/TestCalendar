import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { ComponentesComponent } from './componentes.component';
import { ComponentesRoutingModule } from './componentes-routing.module';

@NgModule({
  declarations: [
    ComponentesComponent
  ],
  imports: [CommonModule, ComponentesRoutingModule, SharedModule]
})
export class ComponentesModule { }
