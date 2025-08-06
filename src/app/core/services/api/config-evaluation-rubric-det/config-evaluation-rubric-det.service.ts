import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ConfigRubricaEvaluacionDetDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigEvaluationRubricDetailService {
    evaluationPeriodList: ConfigRubricaEvaluacionDetDTOV1[];
    constructor(private http: HttpClient) {
        this.evaluationPeriodList = [];
    }

    getAllEvaluationRubricDetail(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<ConfigRubricaEvaluacionDetDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfigRubricaEvaluacionDetDTOV1[]>>>(
            environment.api.concat('/ConfigRubricaEvaluacionDet/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getEvaluationRubricDetailById(id: number): Observable<ResponseV1<ConfigRubricaEvaluacionDetDTOV1>> {
        return this.http.get<ResponseV1<ConfigRubricaEvaluacionDetDTOV1>>(
            environment.api.concat(`/ConfigRubricaEvaluacionDet/GetById?id=${id}`)
        );
    }

    createEvaluationRubricDetail(body: ConfigRubricaEvaluacionDetDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigRubricaEvaluacionDet/Add'), body);
    }

    updateEvaluationRubricDetail(body: ConfigRubricaEvaluacionDetDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ConfigRubricaEvaluacionDet/Update'), body);
    }

    deleteEvaluationRubricDetail(periodoEvaluacionId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(
            environment.api.concat(`/ConfigRubricaEvaluacionDet/Delete?id=${periodoEvaluacionId}`)
        );
    }

    getAllEvaluationRubricDetailExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat(`/ConfigRubricaEvaluacionDet/ExcelDescarga`), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllEvaluationRubricDetail(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllEvaluationRubricDetail(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ConfigRubricaEvaluacionDetDTOV1().deserialize(item));
                    this.evaluationPeriodList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
