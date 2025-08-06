import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { DependenciaAreaDTOV1 } from 'src/app/utils/models/dependencia-area.dto.v1';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class DependencyAreaService {
    constructor(private http: HttpClient) {}

    getAllDependenciaAreas(filters: TablePaginatorSearch): Observable<AppResult<DependenciaAreaDTOV1[]>> {
        return this.http.get<AppResult<DependenciaAreaDTOV1[]>>(
            environment.api.concat('/CatAreaResponsable/GetAllDependenciaArea'),
            {
                params: {
                    ...filters.filter,
                    ...filters,
                },
            }
        );
    }

    getDependenciaAreaById(regionId: number): Observable<ResponseV1<DependenciaAreaDTOV1>> {
        return this.http.get<ResponseV1<DependenciaAreaDTOV1>>(
            environment.api.concat(`/CatDependenciaArea/GetById?id=${regionId}`)
        );
    }

    createDependenciaArea(body: DependenciaAreaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatDependenciaArea/Add'), body);
    }

    updateDependenciaArea(body: DependenciaAreaDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatDependenciaArea/Update'), body);
    }

    disableDependenciaArea(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatDependenciaArea/Disable/`), {
            id: id,
            activo: disable,
        });
    }

    deleteDependenciaArea(dependenciaAreaId: number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/CatDependenciaArea/Delete/?id=${dependenciaAreaId}`));
    }

    getAllDependenciaAreasExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatDependenciaArea/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllDependenciaAreasExcel() {
        return environment.api.concat(`/Export/GetAll/DependenciaArea`);
    }
}
