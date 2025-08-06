import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    CopiadoRequest,
    CopiadoResult,
    EvidenceDTO,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable()
export class EvidencesCatalogService {
    constructor(private http: HttpClient) {}

    getAllEvidence(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<EvidenceDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<EvidenceDTO[]>>>(environment.api.concat('/CatEvidencia/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
        
            },
        });
    }

    getEvidenceById(evidenceId: string | number): Observable<ResponseV1<EvidenceDTO>> {
        return this.http.get<ResponseV1<EvidenceDTO>>(environment.api.concat(`/CatEvidencia/GetById?id=${evidenceId}`));
    }

    createEvidence(body: EvidenceDTO): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatEvidencia/Add'), body);
    }

    updateEvidence(body: EvidenceDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatEvidencia/Update'), body);
    }

    deleteEvidence(evidenceId: string | number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/CatEvidencia/Delete/?id=${evidenceId}`));
    }

    disableEvidence(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatEvidencia/Disable`), {
            id: id,
            activo: disable,
        });
    }

    getAllEvidencesExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatEvidencia/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getEvidenceByEvidenceFile(evidenceId: number): Observable<Response<EvidenceDTO>> {
        return this.http.get<Response<EvidenceDTO>>(environment.api.concat(`/CatEvidencia/GetById?id=${evidenceId}`), {
            params: {
                evidenciaArchivoId: evidenceId,
            },
        });
    }

    async deleteAzureStorageFile(id: number): Promise<ResponseV1<never>> {
        const response = await this.http
            .delete<ResponseV1<never>>(environment.api.concat(`/AzureStorage/DeleteFile/${id}/evidencias`))
            .toPromise();
        return response
      

    }


    GetAzureFile(archivoAzureId: number){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/evidencias`), {
            responseType: 'blob',
        });
    }

    GetAzureFileCapturaEvidencia(archivoAzureId: number){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/ceindicadoresevidencias`), {
            responseType: 'blob',
        });
    }
}
