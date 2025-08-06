import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { FiltroCampusInstitucionRegionDTO, CampusDTO, CampusDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';
import { AppResult } from '../../../../utils/models/AppResult';

@Injectable({ providedIn: 'root' })
export class CampusService {
    campusList: CampusDTOV1[];

    constructor(private http: HttpClient) {
        this.campusList = [];
    }

    getAllCampus(filters: TablePaginatorSearch): Observable<AppResult<CampusDTOV1[]>> {
        return this.http.get<AppResult<CampusDTOV1[]>>(environment.api.concat('/CatCampus/GetAll'), {
            params: {
                ...filters.filter,
                ...filters,
            },
        });
    }

    getCampusPorInstitucionRegion(body: FiltroCampusInstitucionRegionDTO): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatCampus/GetByInstitucionRegion'), body);
    }


    getCampusRegion(regionId: string | number, filters: TablePaginatorSearch): Observable<ResponseV1<CampusDTOV1>> {
        return this.http.get<ResponseV1<CampusDTOV1>>(environment.api.concat(`/CatCampus/GetByRegion?id=${regionId}`), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getCampusById(campusId: string | number): Observable<ResponseV1<CampusDTOV1>> {
        return this.http.get<ResponseV1<CampusDTOV1>>(environment.api.concat(`/CatCampus/GetById?id=${campusId}`));
    }

    createCampus(body: CampusDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatCampus/Add'), body);
    }

    updateCampus(body: CampusDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatCampus/Update'), body);
    }

    disableCampus(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatCampus/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteCampus(campusId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatCampus/Delete?id=${campusId}`));
    }

    getAllCampusExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatCampus/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllCampusExcel() {
        return environment.api.concat(`/Export/GetAll/Campus`);
    }

    async setAllCampus(): Promise<void> {
        //todo j031 240403, ajustar por cambio de apppResult
        const filters = new TablePaginatorSearch();
        const filtro = new CampusDTOV1();
        filtro.activo = true;
        filters.filter = filtro;
        filters.pageSize = 999999;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllCampus(filters).subscribe((response) => {
                if (response.data) {
                    const data = response.data.map((item) => new CampusDTOV1().deserialize(item));
                }
                resolve();
            });
        });
    }
}
