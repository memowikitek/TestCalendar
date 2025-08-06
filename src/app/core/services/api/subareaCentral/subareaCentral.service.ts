import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { SubareaCentralDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class SubareaCentralService{
    subareaCentralList: SubareaCentralDTO[]

    constructor(private http: HttpClient) {
        this.subareaCentralList = [];
    }

    getAllSubareaCentral(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<SubareaCentralDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<SubareaCentralDTO[]>>>(environment.api.concat('/CatSubAreaCentral/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

    getByAreaCentral(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<SubareaCentralDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<SubareaCentralDTO[]>>>(environment.api.concat('/CatSubAreaCentral/GetByAreaCentral'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }


    

}