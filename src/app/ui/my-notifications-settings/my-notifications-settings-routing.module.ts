import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyNotificationsSettingsComponent } from './my-notifications-settings.component';

const routes: Routes = [{ path: '', component: MyNotificationsSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyNotificationsSettingsRoutingModule {}
