import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MatrizMIDTOV1, TablePaginatorSearch, PageResult, PageResultV1 } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
@Injectable({
    providedIn: 'root',
})
export class MatrixMiService {
    MatrizMIList: MatrizMIDTOV1[];
    constructor(private http: HttpClient) {
        this.MatrizMIList = [];
    }

    getAllMatrizMi(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<MatrizMIDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<MatrizMIDTOV1[]>>>(environment.api.concat('/MatrizMI/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
            },
        });
    }

    getMatrizMiById(indicatorId: string | number): Observable<ResponseV1<MatrizMIDTOV1>> {
        return this.http.get<ResponseV1<MatrizMIDTOV1>>(environment.api.concat(`/MatrizMI/GetById?id=${indicatorId}`));
    }

    createMatrizMi(body: MatrizMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/MatrizMI/Add'), body);
    }

    updateMatrizMi(body: MatrizMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/MatrizMI/Update'), body);
    }

    disableMatrizMi(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/MatrizMI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteMatrizMi(id: number): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(environment.api.concat(`/MatrizMI/Delete${id}`));
    }

    getAllMatrizMiExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/MatrizMI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllMatrizMi(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;
        return new Promise((resolve) => {
            this.getAllMatrizMi(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new MatrizMIDTOV1().deserialize(item));
                    this.MatrizMIList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
