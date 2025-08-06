import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePaginatorSearch, PageResult, PageResultV1, PilarEstrategicoMIDTOV1 } from 'src/app/utils/models';

import { environment } from 'src/environments/environment';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';

@Injectable({
    providedIn: 'root',
})
export class PilarEstrategicoMiService {
    StrategicPillarMiList: PilarEstrategicoMIDTOV1[];

    constructor(private http: HttpClient) {
        this.StrategicPillarMiList = [];
    }
    getAllStrategicPillarMi(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<PilarEstrategicoMIDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<PilarEstrategicoMIDTOV1[]>>>(
            environment.api.concat('/PilarEstrategicoMI/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getStrategicPillarMiById(PilarEstrategicoMIId: string | number): Observable<ResponseV1<PilarEstrategicoMIDTOV1>> {
        return this.http.get<ResponseV1<PilarEstrategicoMIDTOV1>>(
            environment.api.concat(`/PilarEstrategicoMI/GetById?id=${PilarEstrategicoMIId}`)
        );
    }

    createStrategicPillarMi(body: PilarEstrategicoMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/PilarEstrategicoMI/Add'), body);
    }

    updateStrategicPillarMi(body: PilarEstrategicoMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/PilarEstrategicoMI/Update'), body);
    }

    disableStrategicPillarMi(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/PilarEstrategicoMI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteStrategicPillarMi(PilarEstrategicoMIId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/PilarEstrategicoMI/Delete?id=${PilarEstrategicoMIId}`));
    }

    getAllStrategicPillarMiExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/PilarEstrategicoMI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllIndicatorsMi(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllStrategicPillarMi(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new PilarEstrategicoMIDTOV1().deserialize(item));
                    this.StrategicPillarMiList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
