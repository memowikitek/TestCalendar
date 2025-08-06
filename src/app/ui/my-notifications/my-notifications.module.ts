import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MyNotificationsComponent } from './my-notifications.component';
import { MyNotificationsRoutingModule } from './my-notifications-routing.module';


@NgModule({
  declarations: [MyNotificationsComponent],
  imports: [CommonModule, SharedModule, MyNotificationsRoutingModule]
})
export class MyNotificationsModule { }
