import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  DetailsIndicatorDTOV1, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { NormativeRecordComponent } from './normative-record.component'
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';

export interface NormativaData {
  data: NormativaDTOV1;
}


@Injectable({
  providedIn: 'root'
})
export class NormativeRecordService {

  constructor(private dialog: MatDialog) {}
  open(data?: any): MatDialogRef<NormativeRecordComponent> {
    return this.dialog.open<NormativeRecordComponent, NormativaData>(NormativeRecordComponent, {
        panelClass: '',
        data: data || null,
            width: '100vw',
            height: '80vh',
            maxHeight: '100vh',
            maxWidth: '100vw',            
    });

  }

/*  async setAllCampus(): Promise<void> {
    const filters = new TablePaginatorSearch();
    const filtro = new IndicadorNormativa();
    filtro.activo = true;
    filters.filter = filtro;
    filters.pageSize = 999999;
    filters.pageNumber = 1;
  
    return new Promise((resolve) => {
        this.getAllNormatives(filters).subscribe((response: { output: any[]; }) => {
            if (response.output) {
                const data = response.output.map((item) => new IndicadorNormativa().deserialize(item));
            }
            resolve();
        });
    });
  }
  getAllNormatives(filters: TablePaginatorSearch) {
    throw new Error('Method not implemented.');
  }*/
  
  
}