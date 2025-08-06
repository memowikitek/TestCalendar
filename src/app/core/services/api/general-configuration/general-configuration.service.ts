import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    AreaCorporativaDTO,
    ConfNivelAreaResponsableDTO,
    ConfigGeneralDTO,
    NivelModalidadDTO,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { ConfiguracionGeneral } from 'src/app/utils/models/configuracion-general';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GeneralConfigurationService {
    generalConfigurationList: ConfNivelAreaResponsableDTO[];
    constructor(private http: HttpClient) {
        this.generalConfigurationList = [];
    }

    getAllGeneralConfigurations(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<ConfNivelAreaResponsableDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ConfNivelAreaResponsableDTO[]>>>(
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

    getGeneralConfigurationById(generalConfigurationId: number): Observable<ResponseV1<ConfiguracionGeneral>> {
        return this.http.get<ResponseV1<ConfiguracionGeneral>>(
            environment.api.concat(`/ConfigGeneral/GetById?id=${generalConfigurationId}`)
        );
    }

    createGeneralConfiguration(body: ConfigGeneralDTO): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/ConfigGeneral/Add'), body);
    }

    updateGeneralConfiguration(body: ConfigGeneralDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/ConfigGeneral/Update'), body);
    }

    disableGeneralConfiguration(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/ConfigGeneral/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteGeneralConfiguration(generalConfigurationId: number): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(
            environment.api.concat(`/ConfigGeneral/Delete?id=${generalConfigurationId}`)
        );
    }

    getAllGeneralConfigurationsExcel(filters: TablePaginatorSearch): Observable<FileResponse> {
        return this.http.get<FileResponse>(environment.api.concat('/ConfigGeneral/ExcelDescarga'), {
            params: {
                ordenar: filters.orderBy,
                dir: filters.dir,
                filtro: filters.search,
                inactivos: filters.inactives,
            },
        });
    }

    async setAllGeneralConfigurations(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllGeneralConfigurations(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ConfNivelAreaResponsableDTO().deserialize(item));
                    this.generalConfigurationList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }

    getGeneralConfigurationLevelModality(): Observable<Response<NivelModalidadDTO[]>> {
        return this.http.get<Response<NivelModalidadDTO[]>>(environment.api.concat('/ConfigGeneral/NivelModalidad'));
    }

    getGeneralConfigurationResponsibiltyAreas(nivelModalidadId: string): Observable<Response<AreaCorporativaDTO[]>> {
        return this.http.get<Response<AreaCorporativaDTO[]>>(
            environment.api.concat(`/ConfigGeneral/NivelModalidad/${nivelModalidadId}/AreaResponsable`),
            {}
        );
    }
}
