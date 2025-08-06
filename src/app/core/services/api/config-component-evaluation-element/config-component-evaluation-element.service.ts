import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
    ConfigComponenteDTOV1,
    ConfigElementosEvaluacionDTOV1,
} from 'src/app/utils/models';
import { ConfigComponentes } from 'src/app/utils/models/config-componentes';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigComponentEvaluationElementService {
    componentList: ConfigComponenteDTOV1[];
    evaluationElementList: ConfigElementosEvaluacionDTOV1[];

    constructor(private http: HttpClient) {
        this.evaluationElementList = [];
    }

    getAllComponents(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ConfigComponentes[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfigComponentes[]>>>(
            environment.api.concat('/ConfigComponentes/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getAllEvalElements(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<ConfigElementosEvaluacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfigElementosEvaluacionDTOV1[]>>>(
            environment.api.concat('/ConfigElementosEvaluacion/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getCompomponentById(id: string | number): Observable<ResponseV1<ConfigComponenteDTOV1>> {
        return this.http.get<ResponseV1<ConfigComponenteDTOV1>>(
            environment.api.concat(`/ConfigComponentes/GetById?id=${id}`)
        );
    }

    getEvalElementById(id: string | number): Observable<ResponseV1<ConfigElementosEvaluacionDTOV1>> {
        return this.http.get<ResponseV1<ConfigElementosEvaluacionDTOV1>>(
            environment.api.concat(`/ConfigElementosEvaluacion/GetById?id=${id}`)
        );
    }

    createComponent(body: ConfigComponentes): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigComponentes/Add'), body);
    }

    deleteComponent(id: string | number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/ConfigComponentes/Delete?id=${id}`));
    }
}
