import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { IndicadorDTO, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { EvidenciasArchivo } from 'src/app/utils/models/evidencias-archivo';
import { environment } from 'src/environments/environment';
import { EvidenciasIndicadorDTO } from 'src/app/core/models/evidencias-indicador-dto';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EvidenciasAreaResponsableAdd } from 'src/app/utils/models/evidencias-area-responsable-add';
import { ResultadosIndicadorDTO } from 'src/app/core/models/resultados-indicador-dto';
import { ResultadoIndicadorCapturaDto } from 'src/app/core/models/resultado-indicador-captura-dto';


@Injectable({
    providedIn: 'root'
})
export class ResultadosIndicadorService {

    constructor(private http: HttpClient) { }

    getAllndicatorsMetasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/ResultadosIndicador/ExcelMetasDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }
   
    getAllResultadosIndicador(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<ResultadosIndicadorDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ResultadosIndicadorDTO[]>>>(
            environment.api.concat('/ResultadosIndicador/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getResultAreaResponsableById(
        cfgGeneralId: number | null,
        metasAreaResponsableId: number | null,
        areaResponsableId: number | null,
        idproceso: number | null
    ): Observable<ResponseV1<ResultadoIndicadorCapturaDto>> {
        let MetaFilter = `/ResultadosIndicador/GetById?idProceso=${idproceso}&cfgGeneralId=${cfgGeneralId}&areaResponsableId=${areaResponsableId}&metasAreaResponsableId=${
            metasAreaResponsableId ?? ''
        }`;
        return this.http.get<ResponseV1<ResultadoIndicadorCapturaDto>>(environment.api.concat(MetaFilter));
    }

    addMetasAreaResponsable(resultadosIndicadoresCaptura: any): Observable<ResponseV1<ResultadoIndicadorCapturaDto>> {
        return this.http.post<ResponseV1<never>>(
            environment.api.concat(`/ResultadosIndicador/Add`),
            resultadosIndicadoresCaptura
        );
    }

}
