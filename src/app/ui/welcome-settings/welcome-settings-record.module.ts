import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomeSettingdRecordRoutingModule } from './welcome-settings-record-routing.module';
import { WelcomeSettingsRecordComponent } from './welcome-settings-record.component';
import { SettingsWelcomeService } from 'src/app/core/services';
import { SharedModule } from 'src/app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { QuillModule } from 'ngx-quill';
import { NoSanitizePipe } from './no-sanitizer.pipe';
import { WelSettingsRecordComponent } from './modals/wel-settings-record/wel-settings-record.component';

const PAGES = [WelcomeSettingsRecordComponent];
const SERVICES = [SettingsWelcomeService];

@NgModule({
    declarations: [PAGES, NoSanitizePipe, WelSettingsRecordComponent],
    imports: [
        CommonModule,
        WelcomeSettingdRecordRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        AngularEditorModule,
        QuillModule.forRoot({ suppressGlobalRegisterWarning: true }),
    ],
    providers: [SERVICES],
})
export class WelcomeSettingsRecordModule {}
