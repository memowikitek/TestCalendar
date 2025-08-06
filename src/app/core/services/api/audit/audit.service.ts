import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Audit, ResponseV1 } from 'src/app/utils/interfaces';
import { AuditDTO, AuditDTOV1, TablePaginatorSearch, PageResultV1, PageResult } from 'src/app/utils/models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AuditRecordComponent } from 'src/app/ui/audits/modals/audit-record/audit-record.component';

export interface AuditData {
    data: AuditDTOV1;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
    constructor(private http: HttpClient, private dialog: MatDialog) {}

    getAllAudits(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<AuditDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<AuditDTO[]>>>(
            environment.api.concat('/ProcesoEvaluacion/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageNumber: filters.pageNumber,
                    pageSize: filters.pageSize,
                },
            }
        );
    }

    getAuditById(auditId: number): Observable<ResponseV1<AuditDTOV1>> {
        return this.http.get<ResponseV1<AuditDTOV1>>(
            environment.api.concat(`/ProcesoEvaluacion/GetById?id=${auditId}`)
        );
    }

    updateAudit(body: AuditDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ProcesoEvaluacion/Update'), body);
    }
    createAudit(body: AuditDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ProcesoEvaluacion/Add'), body);
    }

    deleteAudit(auditId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/ProcesoEvaluacion/Delete/?id=${auditId}`));
    }
    /*
disbaleRegion(id: number, disable: boolean): Observable<ResponseV1<never>> {
  return this.http.patch<never>(environment.api.concat(`/CatRegion/Disable`), {
      id: id,
      activo: disable,
  });
}
*/

    /*servable<ResponseV1<never>> {
  return this.http.post<ResponseV1<never>>(environment.api.concat('/CatRegion/Add'), body);
}

updateRegion(body: RegionDTOV1): Observable<ResponseV1<never>> {
  return this.http.put<ResponseV1<never>>(environment.api.concat('/CatRegion/Update'), body);
}*/

    onCreateDummyTable(): AuditDTO[] {
        let tempList: AuditDTO[];

        // items
        let temp1 = new AuditDTO();
        temp1.id = 1;
        temp1.nombre = 'SIAC';
        temp1.activo = true;
        temp1.totalIndicadores = 172;

        let temp2 = new AuditDTO();
        temp2.id = 2;
        temp2.nombre = 'FMPES';
        temp2.activo = true;
        temp2.totalIndicadores = 240;

        let temp3 = new AuditDTO();
        temp3.id = 3;
        temp3.nombre = 'EVIAC';
        temp3.activo = false;
        temp3.totalIndicadores = 200;

        let temp4 = new AuditDTO();
        temp4.id = 4;
        temp4.nombre = 'CERTIFICADO PARA DOBLE TITULACIÓN';
        temp4.activo = false;
        temp4.totalIndicadores = 0;

        let temp5 = new AuditDTO();
        temp5.id = 5;
        temp5.nombre = 'CERTIFICADO PARA DOBLE TITULACIÓN';
        temp5.activo = false;
        temp5.totalIndicadores = 0;

        let temp6 = new AuditDTO();
        temp6.id = 6;
        temp6.nombre = 'CERTIFICADO PARA DOBLE TITULACIÓN';
        temp6.activo = false;
        temp6.totalIndicadores = 0;

        tempList = [];
        tempList.push(temp1);
        tempList.push(temp2);
        tempList.push(temp3);
        tempList.push(temp4);
        tempList.push(temp5);
        tempList.push(temp6);
        return tempList;
    }

    open(data?: AuditData): MatDialogRef<AuditRecordComponent> {
        return this.dialog.open<AuditRecordComponent>(AuditRecordComponent, {
            panelClass: '',
            // width: '40vw',
            minWidth: '40vw',
            maxHeight: '90vh',
        });
    }
    async setAllCampus(): Promise<void> {
        const filters = new TablePaginatorSearch();
        const filtro = new AuditDTOV1();
        filtro.activo = true;
        filters.filter = filtro;
        filters.pageSize = 999999;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllAudits(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new AuditDTOV1().deserialize(item));
                }
                resolve();
            });
        });
    }
}
