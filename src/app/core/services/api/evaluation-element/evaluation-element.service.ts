import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    AreaResponsableDTO,
    AreaResponsableDTOV1,
    ElementoEvaluacionDTO,
    ElementoEvaluacionProccess,
    ElementoEvaluacionDTOV1,
    ElementoEvaluacionAddUpdateDTO,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
    Anio,
    ElementoEvaluacionCycle,
    PeriodoEvaluacionDTOV1,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EvaluationElementService {
    evaluationElementList: ElementoEvaluacionDTOV1[];

    constructor(private http: HttpClient) {
        this.evaluationElementList = [];
    }

    getAll(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ElementoEvaluacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ElementoEvaluacionDTOV1[]>>>(
            environment.api.concat('/ConfigGeneral/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getCycles(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ElementoEvaluacionCycle[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ElementoEvaluacionCycle[]>>>(
            environment.api.concat('/CatCiclo/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getInstitutions(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ElementoEvaluacionCycle[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ElementoEvaluacionCycle[]>>>(
            environment.api.concat('/CatInstitucion/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getProccess(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<PeriodoEvaluacionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<PeriodoEvaluacionDTOV1[]>>>(
            environment.api.concat('/ConfigGeneral/GetProcesos'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getById(evaluationElementId: string | number): Observable<ResponseV1<ElementoEvaluacionDTOV1>> {
        return this.http.get<ResponseV1<ElementoEvaluacionDTOV1>>(
            environment.api.concat(`/ConfigGeneral/GetById?id=${evaluationElementId}`)
        );
    }

    getAllProccess(
        anio: string | number,
        ciclo: string | number,
        institucion: string | number
    ): Observable<ResponseV1<PageResultV1<ElementoEvaluacionProccess[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ElementoEvaluacionProccess[]>>>(
            environment.api.concat(
                `/ConfigGeneral/GetProcesos?anio=${anio}&idCiclo=${ciclo}&idInstitucion=${institucion}`
            )
        );
    }

    create(body: ElementoEvaluacionAddUpdateDTO): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigGeneral/Add'), body);
    }

    update(body: ElementoEvaluacionAddUpdateDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ConfigGeneral/Update'), body);
    }

    delete(evaluationElementId: string | number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/ConfigGeneral/Disable?id=${evaluationElementId}`));
    }

    getGenericResponsbilitysAreas(generica: boolean): Observable<ResponseV1<AreaResponsableDTOV1[]>> {
        return this.http.get<ResponseV1<AreaResponsableDTOV1[]>>(
            environment.api.concat(`/ConfigGeneral/ElementoEvaluacion/${generica}/AreasResponsables`)
        );
    }

    getEvaluationElementLevelModality(id: string | number): Observable<ResponseV1<AreaResponsableDTOV1[]>> {
        return this.http.get<ResponseV1<AreaResponsableDTOV1[]>>(
            environment.api.concat(`/ConfigGeneral/ElementoEvaluacion/${id}/NivelModalidad`)
        );
    }

    getAllExcel(filters: TablePaginatorSearch): Observable<FileResponse> {
        return this.http.get<FileResponse>(environment.api.concat('/CfgElementoEvaluacion/ExcelDescarga'), {
            params: {
                ordenar: filters.orderBy,
                dir: filters.dir,
                filtro: filters.search,
                inactivos: filters.inactives,
            },
        });
    }

    async setAll(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAll(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ElementoEvaluacionDTOV1().deserialize(item));
                    this.evaluationElementList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }

    getEvaluationElementFileById(archivoId: string | number): Observable<ResponseV1<string>> {
        return this.http.get<ResponseV1<string>>(environment.api.concat(`/ConfigGeneral/getFileById?id=${archivoId}`));
    }
}
