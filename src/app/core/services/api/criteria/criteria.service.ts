import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    CarreraDTOV1,
    CopiadoRequest,
    CopiadoResult,
    CriterioDTO,
    CriterioDTOV1,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CriteriaService {
    public criteriaList: CriterioDTOV1[];

    constructor(private http: HttpClient) {
        this.criteriaList = [];
    }

    getAllCriteria(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CriterioDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CriterioDTOV1[]>>>(environment.api.concat('/Criterio/GetAll'), {
            params: {
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getCriteriaById(criteriaId: string): Observable<ResponseV1<CriterioDTOV1>> {
        return this.http.get<ResponseV1<CriterioDTOV1>>(environment.api.concat(`/Criterio/${criteriaId}`));
    }

    getCareerList(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CarreraDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CarreraDTOV1[]>>>(environment.api.concat('/Carrera/GetAll'), {
            params: {
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
                fiultro: JSON.stringify(filters.filter),
            },
        });
    }

    // copyCriteria(body: CopiadoRequest): Observable<Response<CopiadoResult>> {
    //     return this.http.post<Response<CopiadoResult>>(environment.api.concat('/Criterio/copiar'), body);
    // }

    async setAllCriteria(filters: TablePaginatorSearch): Promise<void> {
        return new Promise((resolve) => {
            this.getAllCriteria(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new CriterioDTOV1().deserialize(item));
                    this.criteriaList = data;
                }
                resolve();
            });
        });
    }
}
