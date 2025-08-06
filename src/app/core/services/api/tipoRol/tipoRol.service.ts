import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { TipoRolDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class TipoRolService{
    tipoRolList: TipoRolDTO[]

    constructor(private http: HttpClient) {
        this.tipoRolList = [];
    }

    getAllTipoRol(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<TipoRolDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<TipoRolDTO[]>>>(environment.api.concat('/TipoRol/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

}