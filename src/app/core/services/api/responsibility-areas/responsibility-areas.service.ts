import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { AreaResponsableDTOV1, CopiadoRequest, CopiadoResult, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AreaResponsableCampusDTO } from '../../../../utils/models/area-responsable-campus.dto';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class ResponsibilityAreasService {
    responsibilityAreasList: AreaResponsableDTOV1[];

    constructor(private http: HttpClient) {
        this.responsibilityAreasList = [];
    }

    getAllResponsibilityAreas(filters: TablePaginatorSearch): Observable<ResponseV1<AreaResponsableDTOV1[]>> {
        return this.http.get<ResponseV1<AreaResponsableDTOV1[]>>(environment.api.concat('/CatAreaResponsable/GetAll'), {
            params: {
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getAllResponsibilityAreasCampus(filters: TablePaginatorSearch): Observable<AppResult<AreaResponsableCampusDTO[]>> {
        return this.http.get<AppResult<AreaResponsableCampusDTO[]>>(
            environment.api.concat('/CatAreaResponsable/GetAllAreaResponsableCampus'),
            {
                params: {
                    ...filters.filter,
                    ...filters,
                },
            }
        );
    }

    getAllResponsibilityAreasCampusFilter(filters: TablePaginatorSearch): Observable<ResponseV1<AreaResponsableCampusDTO[]>> {
        return this.http.get<ResponseV1<AreaResponsableCampusDTO[]>>(environment.api.concat('/CatAreaResponsable/GetAllFilter'),{
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getResponsibilityAreaById(areaResponsabilidadId: string | number): Observable<ResponseV1<AreaResponsableDTOV1>> {
        return this.http.get<ResponseV1<AreaResponsableDTOV1>>(
            environment.api.concat(`/CatAreaResponsable/GetById?id=${areaResponsabilidadId}`)
        );
    }
    getDependenciaAreaById(areaResponsabilidadId: string | number): Observable<AppResult<AreaResponsableDTOV1>> {
        return this.http.get<AppResult<AreaResponsableDTOV1>>(
            environment.api.concat(`/CatAreaResponsable/GetDependenciaAreaById?id=${areaResponsabilidadId}`)
        );
    }

    createResponsibilityArea(body: AreaResponsableDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatAreaResponsable/Add'), body);
    }

    updateResponsibilityArea(body: AreaResponsableDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatAreaResponsable/Update'), body);
    }

    disableResponsibilityArea(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatAreaResponsable/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteResponsibilityArea(areaResponsabilidadId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<ResponseV1<never>>(
            environment.api.concat(`/CatAreaResponsable/Delete?id=${areaResponsabilidadId}`)
        );
    }

    copyResponsibilityArea(body: CopiadoRequest): Observable<Response<CopiadoResult>> {
        return this.http.post<Response<CopiadoResult>>(environment.api.concat('/CatAreaResponsable/copiar'), body);
    }

    getAllResponsibilityAreasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatAreaResponsable/Descarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllResponsibilityAreasExcel() {
        return environment.api.concat(`/Export/GetAll/AreaResponsable`);
    }

    async setAllResponsibilityAreas(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllResponsibilityAreas(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new AreaResponsableDTOV1().deserialize(item));
                    this.responsibilityAreasList = data;
                }
                resolve();
            });
        });
    }
}
