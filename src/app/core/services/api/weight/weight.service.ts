import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResult, PageResultV1, PonderacionDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WeightService {
    ponderacionList: PonderacionDTOV1[];
    constructor(private http: HttpClient) {
        this.ponderacionList = [];
    }

    getAllWeights(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<PonderacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<PonderacionDTOV1[]>>>(
            environment.api.concat('/CatPonderacion/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getWeightByNivelModalidadId(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<PonderacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<PonderacionDTOV1[]>>>(
            environment.api.concat(`/CatPonderacion/GetByNivelModalidadId`),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getWeightById(ponderacionId: string): Observable<ResponseV1<PonderacionDTOV1>> {
        return this.http.get<ResponseV1<PonderacionDTOV1>>(environment.api.concat(`/CatPonderacion/${ponderacionId}`));
    }

    createWeight(body: PonderacionDTOV1): Observable<ResponseV1<never>> {
        // // console.log(body);
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatPonderacion/Add'), body);
    }

    updatWeight(body: PonderacionDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatPonderacion/Update'), body);
    }

    disableWeight(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatPonderacion/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteWeight(id: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatPonderacion/Delete?id=${id}`));
    }

    getAllWeightsExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatPonderacion/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllWeightsExcel() {
        return environment.api.concat(`/Export/GetAll/Ponderacion`);
    }

    async setAllWeights(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllWeights(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new PonderacionDTOV1().deserialize(item));
                    this.ponderacionList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
