import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { SeguridadComponent } from './seguridad.component';
import { SharedModule } from 'src/app/shared';

@NgModule({
    declarations: [SeguridadComponent],
    imports: [CommonModule, SeguridadRoutingModule, SharedModule],
})
export class SeguridadModule {}
