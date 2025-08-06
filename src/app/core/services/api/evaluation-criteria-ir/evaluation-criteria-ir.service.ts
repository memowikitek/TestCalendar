import { I } from '@angular/cdk/keycodes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { CicloEvaDTOV1, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { CriteriosEvaluacionDTO } from 'src/app/utils/models/criterios-evaluacion.dto';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EvaluationCriteriaIrService {
    evaluationCriteriaList: CriteriosEvaluacionDTO[];
    constructor(
        private http: HttpClient,
        private dialog: MatDialog
    ) {
        this.evaluationCriteriaList = [];
    }
    getAllCriteriaEvaluacionCycle(filters: TablePaginatorSearch, procesoEvaluacionId: number): Observable<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloEvaDTOV1[]>>>(
            environment.api.concat('/CriteriosEvaluacionRI/GetAllEvaluationCycles'),
            {
                params: {
                    procesoEvaluacionId: procesoEvaluacionId,
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getAllEvaluationCriterias(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CriteriosEvaluacionDTO[]>>> {
        let params = new HttpParams()
          .set('pageSize', filters.pageSize.toString())
          .set('pageNumber', filters.pageNumber.toString());
    
        if (filters.filter) {
          params = params.set('filtro', JSON.stringify(filters.filter));
        }
    
        if (filters.filter.CicloEvaluacionIds && filters.filter.CicloEvaluacionIds.length > 0) {
          params = params.set('CicloEvaluacionIds', JSON.stringify(filters.filter.CicloEvaluacionIds));
        }
    
        if (filters.filter.EtapaIds && filters.filter.EtapaIds.length > 0) {
          params = params.set('EtapaIds', JSON.stringify(filters.filter.EtapaIds));
        }
    
        return this.http.get<ResponseV1<PageResultV1<CriteriosEvaluacionDTO[]>>>(
          environment.api.concat('/CriteriosEvaluacionRI/GetAll'),
          { params }
        );
    }

    getEvaluationCriteriaById(EvaluationCriteriaId: number): Observable<ResponseV1<CriteriosEvaluacionDTO>> {
        return this.http.get<ResponseV1<CriteriosEvaluacionDTO>>(
            environment.api.concat(`/CriteriosEvaluacionRI/GetById?id=${EvaluationCriteriaId}`)
        );
    }

    createEvaluationCriteria(body: CriteriosEvaluacionDTO): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/Add'), body);
    }

    updateEvaluationCriteria(body: CriteriosEvaluacionDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CriteriosEvaluacionRI/Update'), body);
    }

    disableEvaluationCriteria(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CriteriosEvaluacionRI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    getAllEvaluationCriteriasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CriteriosEvaluacionRI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllEvaluationCriterias(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = 1;
        filters.pageNumber = 1;
        return new Promise((resolve) => {
            this.getAllEvaluationCriterias(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new CriteriosEvaluacionDTO().deserialize(item));
                    this.evaluationCriteriaList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }

    getAllAplicablePhasesToECIR(filters?: any) {
        if(!filters) filters = {filter: {AplicaCriterioEvaluacion: true} };
        return this.http.get(environment.api.concat('/CatEtapa/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'json',
        });
    }
}
