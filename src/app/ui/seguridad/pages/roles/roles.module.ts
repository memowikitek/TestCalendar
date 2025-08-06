import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import {RolesComponent } from './roles.component';
import { RolRecordComponent } from './modals/rol-record/rol-record.component';
import { RolRecordService } from './modals/rol-record/rol-record.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

const PAGES = [RolesComponent];

const MODALS = [RolRecordComponent];

const SERVICES = [RolRecordService];

@NgModule({
    declarations: [PAGES, MODALS],
    imports: [CommonModule, RolesRoutingModule, SharedModule, ReactiveFormsModule, MatTooltipModule],
    providers: [SERVICES],
})
export class RolesModule {}
