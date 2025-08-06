import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    CatalogoElementoEvaluacionDTO,
    CatalogoElementoEvaluacionDTOV1,
    TablePaginatorSearch,
    PageResult,
    PageResultV1,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EvaluationElementCatalogService {
    catalogEvaluationElementList: CatalogoElementoEvaluacionDTOV1[];
    constructor(private http: HttpClient) {
        this.catalogEvaluationElementList = [];
    }

    getAllEvaluationElementsCatalogs(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<CatalogoElementoEvaluacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CatalogoElementoEvaluacionDTOV1[]>>>(
            environment.api.concat('/CatElementoEvaluacion/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getEvaluationItemIdsByComponent(id: number): Observable<ResponseV1<number>> {
        return this.http.get<ResponseV1<number>>(
            environment.api.concat(`/CatElementoEvaluacion/GetEvaluationItemIdsByComponent?id=${id}`)
        );
    }

    getEvaluationElementCatalogById(
        catalogEvaluationElementId: number
    ): Observable<ResponseV1<CatalogoElementoEvaluacionDTOV1>> {
        return this.http.get<ResponseV1<CatalogoElementoEvaluacionDTOV1>>(
            environment.api.concat(`/CatElementoEvaluacion/GetById?id=${catalogEvaluationElementId}`)
        );
    }

    createEvaluationElementCatalog(body: CatalogoElementoEvaluacionDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatElementoEvaluacion/Add'), body);
    }

    updateEvaluationElementCatalog(body: CatalogoElementoEvaluacionDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatElementoEvaluacion/Update/'), body);
    }

    disableEvaluationElementCatalog(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatElementoEvaluacion/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteEvaluationElementCatalog(cataloEvaluationElementId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(
            environment.api.concat(`/CatElementoEvaluacion/Delete?id=${cataloEvaluationElementId}`)
        );
    }

    getAllEvaluationElementsCatalogsExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatElementoEvaluacion/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllEvaluationElementsCatalogsExcel() {
        return environment.api.concat(`/Export/GetAll/ElementoEvaluacion`);
    }

    async setAllEvaluationElementCatalogs(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllEvaluationElementsCatalogs(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new CatalogoElementoEvaluacionDTOV1().deserialize(item));
                    this.catalogEvaluationElementList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
