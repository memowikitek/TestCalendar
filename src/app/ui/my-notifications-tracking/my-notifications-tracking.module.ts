import { NgModule } from '@angular/core';
import { CommonModule, NgFor, AsyncPipe } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MyNotificationsTrackingComponent } from './my-notifications-tracking.component';
import { MyNotificationsTrackingRoutingModule } from './my-notifications-tracking-routing';


@NgModule({
  declarations: [MyNotificationsTrackingComponent],
  imports: [CommonModule,SharedModule,MyNotificationsTrackingRoutingModule, MatSelectModule, ReactiveFormsModule, NgFor, AsyncPipe]
})
export class MyNotificationsTrackingModule { }
