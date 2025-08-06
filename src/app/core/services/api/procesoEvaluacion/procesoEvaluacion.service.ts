import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ProcesoEvaluacionDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class ProcesoEvaluacionService{
    procesosEvaluacionList: ProcesoEvaluacionDTO[]

    constructor(private http: HttpClient) {
        this.procesosEvaluacionList = [];
    }

    getAllProcesosEvaluacion(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ProcesoEvaluacionDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ProcesoEvaluacionDTO[]>>>(environment.api.concat('/ProcesoEvaluacion/GetAllCatalogo'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

}