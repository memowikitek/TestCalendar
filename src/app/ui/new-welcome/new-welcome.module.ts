import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { NewWelcomeComponent } from './new-welcome.component';
import { NewWelcomeRoutingModule } from './new-welcome-routing.module';

@NgModule({
  declarations: [NewWelcomeComponent],
  imports: [CommonModule,SharedModule,NewWelcomeRoutingModule]
})
export class NewWelcomeModule { }
