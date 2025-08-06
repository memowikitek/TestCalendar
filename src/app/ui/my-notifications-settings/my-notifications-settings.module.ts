import { NgModule } from '@angular/core';
import { CommonModule, NgFor, AsyncPipe } from '@angular/common';
import { SharedModule } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MyNotificationsSettingsComponent } from './my-notifications-settings.component';
import { MyNotificationsSettingsRoutingModule } from './my-notifications-settings-routing.module';
import { NotificationsSettingsRecordComponent } from './modals/notifications-settings-record/notifications-settings-record.component';
import { QuillModule } from 'ngx-quill';

const PAGES = [MyNotificationsSettingsComponent];
//const SERVICES = [CyclesService];
const MODALS = [NotificationsSettingsRecordComponent];

@NgModule({
  declarations: [PAGES, MODALS],
  imports: [CommonModule, SharedModule, MyNotificationsSettingsRoutingModule, MatSelectModule, ReactiveFormsModule, NgFor, AsyncPipe,MatAutocompleteModule,
    QuillModule.forRoot({ suppressGlobalRegisterWarning: true })],
  //providers: [SERVICES]
})
export class MyNotificationsSettingsModule { }
