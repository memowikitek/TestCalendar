import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { verifyHostBindings } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    TablePaginatorSearch,
    PageResultV1,
    FileAzureDTOV1,
    ConfigIndicadorDTOV1,
    ConfigIndicadorEvidenciasDTOV1,
} from 'src/app/utils/models';
import { ConfigIndicadoresModel } from 'src/app/utils/models/ConfigIndicadores.dto.v1';
import { ConfigIndicadoresFormDTOV1 } from 'src/app/utils/models/ConfigIndicadoresForm.dto.v1';
import { ConfigComponentes } from 'src/app/utils/models/config-componentes';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigIndicatorService {
    configIndicadorList: ConfigIndicadorDTOV1[];
    configIndicadorEvidenceList: ConfigIndicadorEvidenciasDTOV1[];
    azureStorageFiles: FileAzureDTOV1[];

    constructor(private http: HttpClient) {
        this.configIndicadorList = [];
        this.azureStorageFiles = [];
    }

    getAllConfigIndicador(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ConfigComponentes[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfigComponentes[]>>>(
            environment.api.concat('/ConfigIndicador/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getConfigIndicadorById(ConfigIndicadorId: number): Observable<ResponseV1<ConfigIndicadorDTOV1>> {
        return this.http.get<ResponseV1<ConfigIndicadorDTOV1>>(
            environment.api.concat(`/ConfigIndicador/GetById?id=${ConfigIndicadorId}`)
        );
    }

    createConfigIndicadorAddAreas(body: ConfigIndicadoresModel): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigIndicador/AddAreas'), body);
    }

    createConfigIndicador(body: FormData): Observable<ResponseV1<never>> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            }),
        };
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigIndicador/Add'), body);
    }

    updatConfigIndicador(body: FormData): Observable<ResponseV1<never>> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            }),
        };
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigIndicador/Update'), body);
    }

    deleteConfigIndicador(
        cfgComponenteId: number,
        elementoEvaluacionId: number,
        indicadorSIACId: number
    ): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(
            environment.api.concat(
                `/ConfigIndicador/Delete/${cfgComponenteId}/${elementoEvaluacionId}/${indicadorSIACId}`
            )
        );
    }

    getAllConfigIndicadorExcel(idPeriodo: number, idArea: number) {
        return this.http.get(environment.api.concat(`/ConfigIndicador/ExcelDescarga/${idPeriodo}/${idArea}`), {
            responseType: 'blob',
        });
    }

    getAllConfigEvidencia(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<ConfigIndicadorEvidenciasDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfigIndicadorEvidenciasDTOV1[]>>>(
            environment.api.concat('/ConfigEvidencias/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    ordenar: filters.orderBy,
                    dir: filters.dir,
                    filtro: filters.search,
                    inactivos: filters.inactives,
                },
            }
        );
    }

    getConfigEvidenciaById(ConfigEvidenciaId: number): Observable<ResponseV1<ConfigIndicadorEvidenciasDTOV1>> {
        return this.http.get<ResponseV1<ConfigIndicadorEvidenciasDTOV1>>(
            environment.api.concat(`/ConfigEvidencias/GetById?id=${ConfigEvidenciaId}`)
        );
    }

    createConfigEvidencia(body: ConfigIndicadorEvidenciasDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigEvidencias/Add'), body);
    }

    updatConfigEvidencia(body: ConfigIndicadorEvidenciasDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ConfigEvidencias/Update'), body);
    }

    deleteConfigEvidencia(ConfigEvidenciaId: string | number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/ConfigEvidencias/Delete?id=${ConfigEvidenciaId}`));
    }

    uploadAzureStorageFile(body: FormData): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/AzureStorage/UploadFile'), body);
    }

    downloadAzureStorageFile(id: string | number): Observable<any> {
        const options = { headers: new HttpHeaders({ accept: '*/*' }) };
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${id}/evidencias`), {
            responseType: 'blob',
        });
    }

    async deleteAzureStorageFile(id: number): Promise<ResponseV1<never>> {
        const response = await this.http
            .delete<ResponseV1<never>>(environment.api.concat(`/AzureStorage/Delete/${id}/'evidencias'`))
            .toPromise();
        return response;
    }
}
