import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePaginatorSearch, PageResult, PageResultV1, IndicadorMIDTOV1 } from 'src/app/utils/models';

import { environment } from 'src/environments/environment';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';

@Injectable({
    providedIn: 'root',
})
export class IndicatorMiService {
    indicatorMiList: IndicadorMIDTOV1[];

    constructor(private http: HttpClient) {
        this.indicatorMiList = [];
    }
    getAllIndicatorMi(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<IndicadorMIDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<IndicadorMIDTOV1[]>>>(
            environment.api.concat('/IndicadorMI/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getIndicatorMiById(IndicadorMIId: string | number): Observable<ResponseV1<IndicadorMIDTOV1>> {
        return this.http.get<ResponseV1<IndicadorMIDTOV1>>(
            environment.api.concat(`/IndicadorMI/GetById?id=${IndicadorMIId}`)
        );
    }

    createIndicatorMi(body: IndicadorMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/IndicadorMI/Add'), body);
    }

    updateIndicatorMi(body: IndicadorMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/IndicadorMI/Update'), body);
    }

    disableIndicatorMi(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/IndicadorMI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteIndicatorMi(IndicadorMIId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/IndicadorMI/Delete?id=${IndicadorMIId}`));
    }

    getAllIndicatorsMiExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/IndicadorMI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllIndicatorsMiExcel() {
        return environment.api.concat(`/Export/GetAll/IndicadorMI`);
    }

    async setAllIndicatorsMi(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 100;
        filters.pageNumber = 0;

        return new Promise((resolve) => {
            this.getAllIndicatorMi(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new IndicadorMIDTOV1().deserialize(item));
                    this.indicatorMiList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
