import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    IndicadorSiacDTO,
    IndicadorSiacDTOV1,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class IndicatorSiacService {
    indicatorSiacList: IndicadorSiacDTOV1[];

    constructor(private http: HttpClient) {
        this.indicatorSiacList = [];
    }

    getAllIndicatorsSiac(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<IndicadorSiacDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<IndicadorSiacDTOV1[]>>>(
            environment.api.concat('/CatIndicadorSiac/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getIndicatorSiacById(indicadorSiacId: number): Observable<ResponseV1<IndicadorSiacDTOV1>> {
        return this.http.get<ResponseV1<IndicadorSiacDTOV1>>(
            environment.api.concat(`/CatIndicadorSiac/GetById?id=${indicadorSiacId}`)
        );
    }

    createIndicatorSiac(body: IndicadorSiacDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatIndicadorSiac/Add'), body);
    }

    updateIndicatorSiac(body: IndicadorSiacDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatIndicadorSiac/Update'), body);
    }

    disableIndicatorSiac(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatIndicadorSiac/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteIndicatorSiac(indicadorSiacId: number): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(
            environment.api.concat(`/CatIndicadorSiac/Delete?id=${indicadorSiacId}`)
        );
    }

    getAllIndicadorSiacExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatIndicadorSiac/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllIndicadorSiacExcel() {
        return environment.api.concat(`/Export/GetAll/IndicadorSIAC`);
    }

    async setAllIndicatorSiac(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllIndicatorsSiac(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new IndicadorSiacDTOV1().deserialize(item));
                    this.indicatorSiacList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
