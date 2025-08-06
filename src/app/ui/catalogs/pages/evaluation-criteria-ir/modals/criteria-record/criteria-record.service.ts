import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CicloEvaDTOV1, EtapaEvaluacion, FiltersModal } from 'src/app/utils/models';
import { CriteriaRecordComponent } from './criteria-record.component';
import { CriteriosEvaluacionDTO } from 'src/app/utils/models/criterios-evaluacion.dto';

export interface CriteriaRecordData {
    dataCR: CriteriosEvaluacionDTO;
    filters: FiltersModal;
}

export interface CicloEvaluacionData {
    dataCE: CicloEvaDTOV1;
    filters: FiltersModal;
}
export interface EtapasData {
    dataE: EtapaEvaluacion;
    filters: FiltersModal;
}

@Injectable()
export class CriteriaRecordService {
    constructor(private dialog: MatDialog) {}

    open(data?: CriteriosEvaluacionDTO): MatDialogRef<CriteriaRecordComponent> {
        return this.dialog.open<CriteriaRecordComponent, CriteriosEvaluacionDTO, EtapaEvaluacion>(CriteriaRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '49vw',
            maxHeight: '100vh',
        });
    }
}
