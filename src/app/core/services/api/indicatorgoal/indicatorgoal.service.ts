import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { MetasIndicadoresDTOV1 } from '../../../../../app/utils/models/metas-indicadores.dto.v1';
import { MetasIndicadoresDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class IndicatorgoalService {
    metasIndicadorDto: MetasIndicadoresDTOV1[];
    constructor(private http: HttpClient) {
        this.metasIndicadorDto = [];
    }

    getAllIndicatorsSiac(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<MetasIndicadoresDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<MetasIndicadoresDTOV1[]>>>(
            environment.api.concat('/MetasAreaResponsable/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }
    getAllndicatorsMetasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/MetasAreaResponsable/ExcelMetasDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }
    getAllndicatorsMetasAdminExcel(
        idProceso: number | null,
        cfgGeneralId: number | null,
        areaResponsableId: number | null,
        metasAreaResponsableId: number | null,
        userId: number | null
    ) {
        return this.http.get(
            environment.api.concat(
                `/MetasAreaResponsable/ExcelMetasIndicadoresDescarga/${idProceso}/${cfgGeneralId}/${areaResponsableId}/${metasAreaResponsableId}/${userId}`
            ),
            {
                responseType: 'blob',
            }
        );
    }
}
