import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatrixMiRoutingModule } from './matrix-mi-routing.module';
import { MatrixMiComponent } from './matrix-mi.component';
import { ComponentsMiComponent } from './pages/components-mi/components-mi.component';
import { PilarEstrategicoMiComponent } from './pages';
import { IndicatorsMiComponent } from './pages/indicators-mi/indicators-mi.component';
import { SubIndicatorsMiComponent } from './pages/sub-indicators-mi/sub-indicators-mi.component';
import { SharedModule } from 'src/app/shared';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentMiRecordComponent, ComponentMiRecordService } from './pages/components-mi/modals';
import { IndicatorMiRecordComponent, IndicatorMiRecordService } from './pages/indicators-mi/modals';
import { SubIndicatorMiRecordComponent, SubIndicatorMiRecordService } from './pages/sub-indicators-mi/modals';
import { MatrixMiRecordComponent, MatrixMiRecordService } from './modals';
import { PilarEstrategicoMiRecordComponent, PilarEstrategicoMiRecordService } from './pages/strategic-pillar-mi/modals';

const PAGES = [
    ComponentsMiComponent,
    PilarEstrategicoMiComponent,
    IndicatorsMiComponent,
    SubIndicatorsMiComponent,
    MatrixMiComponent,
];

const MODALS = [
    ComponentMiRecordComponent,
    PilarEstrategicoMiRecordComponent,
    IndicatorMiRecordComponent,
    SubIndicatorMiRecordComponent,
    MatrixMiRecordComponent,
];

const SERVICES = [
    ComponentMiRecordService,
    PilarEstrategicoMiRecordService,
    IndicatorMiRecordService,
    SubIndicatorMiRecordService,
    MatrixMiRecordService,
];

@NgModule({
    declarations: [PAGES, MODALS],
    imports: [CommonModule, MatrixMiRoutingModule, SharedModule, ReactiveFormsModule],
    providers: [SERVICES],
})
export class MatrixMiModule {}
