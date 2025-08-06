import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LevelRecordComponent } from './modals/level-record/level-record.component';
import { LevelComponent } from './level.component';
import { LevelRecordService } from './modals';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { LevelRoutingModule } from './level-routing.module';

const PAGES = [LevelComponent];

const MODALS = [LevelRecordComponent];

const SERVICES = [LevelRecordService];

@NgModule({
    declarations: [PAGES, MODALS],
    imports: [CommonModule, LevelRoutingModule, SharedModule, ReactiveFormsModule],
    providers: [SERVICES],
})
export class LevelModule {}
