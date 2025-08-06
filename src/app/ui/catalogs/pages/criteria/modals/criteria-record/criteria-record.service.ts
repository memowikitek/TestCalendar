import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CriterioDTOV1, FiltersModal } from 'src/app/utils/models';
import { CriteriaRecordComponent } from './criteria-record.component';

export interface CriteriaRecordData {
    data: CriterioDTOV1;
    filters: FiltersModal;
}

@Injectable()
export class CriteriaRecordService {
    constructor(private dialog: MatDialog) {}

    open(data: CriteriaRecordData): MatDialogRef<CriteriaRecordComponent> {
        return this.dialog.open<CriteriaRecordComponent>(CriteriaRecordComponent, {
            panelClass: '',
            data: data || null,
            disableClose: true,
            minWidth: '50vw',
            maxHeight: '90vh',
        });
    }
}
