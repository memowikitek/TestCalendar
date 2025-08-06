import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './configurations.component';
import { SharedModule } from 'src/app/shared';
import { CampusComponent } from './pages/campus/campus.component';
import { CampusRecordComponent } from './pages/campus/modals/campus-record/campus-record.component';

@NgModule({
    declarations: [ConfigurationsComponent,CampusComponent,CampusRecordComponent],
    imports: [CommonModule, ConfigurationsRoutingModule, SharedModule],
})
export class ConfigurationsModule {}
