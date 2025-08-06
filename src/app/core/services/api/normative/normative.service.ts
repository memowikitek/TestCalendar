import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { NormativaDTO, NormativaDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NormativeService {
    normativesList: NormativaDTOV1[];
    constructor(private http: HttpClient) {
        this.normativesList = [];
    }

    getAllNormatives(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<NormativaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<NormativaDTOV1[]>>>(
            environment.api.concat('/CatNormativa/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getnormativeById(normativeId: number): Observable<ResponseV1<NormativaDTOV1>> {
        return this.http.get<ResponseV1<NormativaDTOV1>>(
            environment.api.concat(`/CatNormativa/GetById?id=${normativeId}`)
        );
    }

    createNormative(body: NormativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatNormativa/Add'), body);
    }

    updateNormative(body: NormativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatNormativa/Update'), body);
    }

    disableNormative(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatNormativa/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteNormative(normativeId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatNormativa/Delete?id=${normativeId}`));
    }

    getAllNormativesExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatNormativa/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllNormativesExcel() {
        return environment.api.concat(`/Export/GetAll/Normativa`);
    }

    async setAllNormatives(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = 1;
        filters.pageNumber = 1;
        return new Promise((resolve) => {
            this.getAllNormatives(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new NormativaDTOV1().deserialize(item));
                    this.normativesList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
