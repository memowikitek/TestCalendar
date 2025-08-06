import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { InformeRisRecordService } from './modals';
import { InformeRISRecordComponent } from './modals/informe-ris-record/informe-ris-record.component';
import { InformeRevInstRoutingModule } from './informe-rev-inst-routing.module';
import { InformeRevInstComponent } from './informe-rev-inst.component';

import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

const PAGES = [InformeRevInstComponent]; 

const MODALS = [InformeRISRecordComponent];

const SERVICES = [InformeRisRecordService];

@NgModule({
    declarations: [PAGES,MODALS],
    imports: [CommonModule, InformeRevInstRoutingModule, SharedModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule],
    providers: [SERVICES],
})
export class InformeRevInstModule {}