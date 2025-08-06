import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResult, PageResultV1, RubricaEvaluacionDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { RubricaEscalaDTOV1 } from 'src/app/utils/models/config-rubrica-escala.dto.v1';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigEvaluationRubricService {
    evaluationPeriodList: RubricaEvaluacionDTOV1[];
    constructor(private http: HttpClient) {
        this.evaluationPeriodList = [];
    }

    getAllEvaluationRubric(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<RubricaEvaluacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<RubricaEvaluacionDTOV1[]>>>(
            environment.api.concat('/ConfigRubricaEvaluacion/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getAllScalesRubric(): Observable<ResponseV1<PageResultV1<RubricaEscalaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<RubricaEscalaDTOV1[]>>>(
            environment.api.concat('/ConfigRubricaEvaluacion/GetAllEscala')
        );
    }

    getEvaluationRubricById(periodoEvaluacionId: number): Observable<ResponseV1<RubricaEvaluacionDTOV1>> {
        return this.http.get<ResponseV1<RubricaEvaluacionDTOV1>>(
            environment.api.concat(`/ConfigRubricaEvaluacion/GetById?id=${periodoEvaluacionId}`)
        );
    }

    getProccess(
        anio: string | number,
        ciclo: string | number,
        institucion: string | number
    ): Observable<ResponseV1<RubricaEvaluacionDTOV1>> {
        return this.http.get<ResponseV1<RubricaEvaluacionDTOV1>>(
            environment.api.concat(
                `/ConfigRubricaEvaluacion/GetProcesoSiguiente?anio=${anio}&ciclo=${ciclo}&institucion=${institucion}`
            )
        );
    }

    // getAllEvaluationRubricExcel(filters: TablePaginatorSearch) {
    //     return this.http.get(environment.api.concat(`/ConfigRubricaEvaluacion/ExcelDescarga`), {
    //         params: {
    //             filtro: JSON.stringify(filters.filter),
    //         },
    //         responseType: 'blob',
    //     });
    // }

    disableEvaluationRubic(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/ConfigRubricaEvaluacion/Disable`), {
            id: id,
            activo: disable,
        });
    }

    async setAllEvaluationRubric(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllEvaluationRubric(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new RubricaEvaluacionDTOV1().deserialize(item));
                    this.evaluationPeriodList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
