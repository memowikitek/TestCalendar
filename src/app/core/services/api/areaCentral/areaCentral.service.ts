import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { AreaCentralDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class AreaCentralService{
    areaCentralList: AreaCentralDTO[]

    constructor(private http: HttpClient) {
        this.areaCentralList = [];
    }

    getAllAreaCentral(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<AreaCentralDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<AreaCentralDTO[]>>>(environment.api.concat('/CatAreaCentral/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

}