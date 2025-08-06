import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { UnauthorizedRolComponent } from './unauthorized-rol.component';
import { UnauthorizedRolRoutingModule } from './unauthorized-rol-routing.module';

@NgModule({
  declarations: [UnauthorizedRolComponent],
  imports: [CommonModule,SharedModule,UnauthorizedRolRoutingModule]
})
export class UnauthorizedRolModule { }
