import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralConfigComponent } from './general-config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { GeneralConfigRoutingModule } from './general-config.routing';
import { ConfigGeneralComponent } from './config-general/config-general.component';
import { ConfigElementsComponent } from './config-elements/config-elements.component';
import { ConfigIndicatorsComponent } from './config-indicators/config-indicators.component';
import { ConfigRubricaComponent } from './config-rubrica/config-rubrica.component';
import { SharedUiControlsModule } from 'src/app/ui/shared-controls/shared-Ui-controls.module';
import { QuillModule } from 'ngx-quill';
import { OverlayModule } from '@angular/cdk/overlay';

const PAGES = [
    GeneralConfigComponent,
    ConfigGeneralComponent,
    ConfigElementsComponent,
    ConfigIndicatorsComponent,
    ConfigRubricaComponent,
];

@NgModule({
    declarations: [PAGES],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        GeneralConfigRoutingModule,
        SharedUiControlsModule,
        OverlayModule,
        QuillModule.forRoot({ suppressGlobalRegisterWarning: true }),
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GeneralConfigModule {}
