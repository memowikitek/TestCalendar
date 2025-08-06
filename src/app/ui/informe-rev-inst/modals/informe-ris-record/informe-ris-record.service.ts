import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InformeRevInstDTO } from 'src/app/utils/models/informe-rev-inst.dto';
import { InformeRISRecordComponent } from './informe-ris-record.component'

@Injectable()
export class InformeRisRecordService {
    constructor(private dialog: MatDialog) { }

    open(data?: InformeRevInstDTO): MatDialogRef<InformeRISRecordComponent> {
        return this.dialog.open<InformeRISRecordComponent, InformeRevInstDTO>(InformeRISRecordComponent, {
            panelClass: '',
            data: data || null,
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
}

