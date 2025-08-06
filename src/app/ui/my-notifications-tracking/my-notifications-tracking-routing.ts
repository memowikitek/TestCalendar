import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyNotificationsTrackingComponent } from './my-notifications-tracking.component';

const routes: Routes = [{ path: '', component: MyNotificationsTrackingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyNotificationsTrackingRoutingModule {}
