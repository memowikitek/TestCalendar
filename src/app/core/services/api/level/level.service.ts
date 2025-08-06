import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { NivelDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LevelService {
    list: NivelDTOV1[];

    constructor(private http: HttpClient) {
        this.list = [];
    }

    getAllLevel(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<NivelDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<NivelDTOV1[]>>>(environment.api.concat('/CatNivel/GetAll'), {
            params: {
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getLevelById(LevelId: number): Observable<ResponseV1<NivelDTOV1>> {
        return this.http.get<ResponseV1<NivelDTOV1>>(environment.api.concat(`/CatNivel/GetById?id=${LevelId}`));
    }

    createLevel(body: NivelDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatNivel/Add'), body);
    }

    updateLevel(body: NivelDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatNivel/Update/'), body);
    }

    disableLevel(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatNivel/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteLevel(LevelId: number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/CatNivel/Delete?id=${LevelId}`));
    }

    getAllLevelExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatNivel/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }
}
