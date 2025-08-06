import { NgModule } from '@angular/core';
import { HeaderEvaluationConfigurationComponent } from './header-evaluation-configuration/header-evaluation-configuration.component';
import { SharedModule } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { ConfigurationsRoutingModule } from '../configurations/configurations-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalIndicatorGoalsComponent } from './modal-indicator-goals/modal-indicator-goals.component';
import { ModalEvidenceAdminComponent } from './modal-evidence-admin/modal-evidence-admin.component';
import { SubModalFileEvidenceConfigComponent } from './modal-evidence-admin/sub-modal-file-evidence-config/sub-modal-file-evidence-config.component';
import { FormsModule } from '@angular/forms'; 
import { ModalIndicatorResultsComponent } from './modal-indicator-results/modal-indicator-results.component';

@NgModule({
    declarations: [HeaderEvaluationConfigurationComponent, ModalIndicatorGoalsComponent, ModalEvidenceAdminComponent, SubModalFileEvidenceConfigComponent,ModalIndicatorResultsComponent],
    imports: [CommonModule, ConfigurationsRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
    exports: [HeaderEvaluationConfigurationComponent, ModalIndicatorGoalsComponent],
})
export class SharedUiControlsModule {}
