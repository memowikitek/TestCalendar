import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SettingdRoutingModule } from './rol-selection-routing.module';
import { RolSelectionComponent } from './rol-selection.component';
import { SettingsWelcomeService } from 'src/app/core/services';
import { SharedModule } from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

const PAGES = [RolSelectionComponent];
const SERVICES = [SettingsWelcomeService];

@NgModule({
  declarations: [PAGES,],
  imports: [CommonModule, SettingdRoutingModule, SharedModule, ReactiveFormsModule, QuillModule],
  providers: [SERVICES],
})
export class RolSelectionScreenModule {}
