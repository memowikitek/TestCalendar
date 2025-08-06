import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InputRestrictionDirective } from './directives/input-restriction/input-restriction.directive';
import { PermissionDirective } from './directives/permission/permission.directive';
import { UploadFileDirective } from './directives/upload-file/upload-file.directive';
import { MaterialModule } from './modules/material/material.module';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';
import {
    BreadcrumbsComponent,
    NotificationAntdComponent,
    UploadAzureComponent,
    SidenavComponent,
    TitleComponent,
    VisorNotificationsComponent,
    ParametersControlComponent,
    //ComparatorComponent,
    //SelectSearchGroupComponent,
    //SelectSearchObjectComponent,
    //SelectSearchSimpleComponent,
    //SelectSimpleComponent,
    //IndicatorNMComponent,
    //BarProgressComponent,
    //TitleCycleBarComponent,
    //BarProgressBsComponent,
    //TitleBarComponent,
    //ResumenBarComponent,
    //BarProgressGrafComponent,
    //TitleGrafComponent,
    //ResumenCycleBarComponent,
    //CardsCycleComponent,
    //BarProgressBsCaptureComponent,
    //SeleccionEtapaComponent
} from './components';
const DIRECTIVES = [InputRestrictionDirective, PermissionDirective, UploadFileDirective];
const COMPONENTS = [
    BreadcrumbsComponent,
    NotificationAntdComponent,
    UploadAzureComponent,
    SidenavComponent,
    TitleComponent,
    VisorNotificationsComponent,
    ParametersControlComponent,
    //ComparatorComponent,
    //SelectSearchGroupComponent,
    //SelectSearchObjectComponent,
    //SelectSearchSimpleComponent,
    //SelectSimpleComponent,
    //IndicatorNMComponent,
    //BarProgressComponent,
    //TitleCycleBarComponent,
    //BarProgressBsComponent,
    //TitleBarComponent,
    //ResumenBarComponent,
    //BarProgressGrafComponent,
    //TitleGrafComponent,
    //ResumenCycleBarComponent,
    //CardsCycleComponent,
    //BarProgressBsCaptureComponent,
    //SeleccionEtapaComponent
];
const PIPES = [SafeHTMLPipe];

@NgModule({
    declarations: [DIRECTIVES, COMPONENTS, PIPES],
    imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgxMatSelectSearchModule],
    exports: [MaterialModule, DIRECTIVES, COMPONENTS, PIPES],
})
export class SharedModule {}
