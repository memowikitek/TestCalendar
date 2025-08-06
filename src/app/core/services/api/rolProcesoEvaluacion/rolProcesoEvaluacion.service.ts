import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { RolProcesoDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class RolProcesoService{
    rolProcesoList: RolProcesoDTO[]

    constructor(private http: HttpClient) {
        this.rolProcesoList = [];
    }

    getAllRolesProcesoEvaluacion(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<RolProcesoDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<RolProcesoDTO[]>>>(environment.api.concat('/AuthRol/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

}