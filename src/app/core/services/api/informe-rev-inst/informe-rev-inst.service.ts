import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResultV1 } from 'src/app/utils/models/';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/utils/helpers';
import { InformeRevInstDTO } from 'src/app/utils/models/informe-rev-inst.dto';
import { firstValueFrom } from 'rxjs';
import { CicloV2DTO } from 'src/app/utils/models/ciclo.v2.dto';
import { Perfil, TablePaginatorSearch, } from 'src/app/utils/models';

@Injectable({ providedIn: 'root' })

export class InformeRevInstService {
    userSession: Perfil;

    constructor(private http: HttpClient) {
        this.userSession = new Perfil();    
        this.updateSessionInfo();
    }

    updateSessionInfo(): void
    {
        let sessionValues = Auth.getSession();
        if (sessionValues != null){
            this.userSession = Auth.getSession()
        }
    }

    getAllInformes(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<InformeRevInstDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<InformeRevInstDTO[]>>>(
            environment.api.concat('/InformeRI/GetFiltrados'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getInformeById(informeId: string | number): Observable<ResponseV1<InformeRevInstDTO>> {
        return this.http.get<ResponseV1<InformeRevInstDTO>>(environment.api.concat(`/InformeRI/GetById?id=${informeId}`));
    }

    getAllCiclos(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<CicloV2DTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<CicloV2DTO[]>>>(environment.api.concat('/CfgCicloEvaluacion/GetAllCicloBase'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

    creaInforme(body: InformeRevInstDTO): Observable<ResponseV1<never>> { console.log("body", body);
        return this.http.post<ResponseV1<never>>(environment.api.concat('/InformeRI/Add'), body);
    }

    updateInforme(body: InformeRevInstDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/InformeRI/Update'), body);
    }

    deleteInforme(id: string | number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/InformeRI/DeleteInforme/?id=${id}`));
    }

    satusInforme(id: number, status: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/InformeRI/Status`), {
            id: id,
            activo: status,
        });
    }
    
    getAllInformesExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/InformeRI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

//Archivos 
    async deleteAzureStorageFile(id: number): Promise<ResponseV1<never>> {
        return await this.http.delete<ResponseV1<never>>(environment.api.concat(`/InformeRI/DeleteFile?idFile=${id}`)).toPromise();
    }

    GetAzureFile(archivoAzureId: number){
        return this.http.get(environment.api.concat(`/AzureStorage/Download/${archivoAzureId}/informerevisioninst`), {
            responseType: 'blob',
        });
    }

    
}