import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResult, PageResultV1, RegionDTO, RegionDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionsService {
    constructor(private http: HttpClient) {}

    getAllRegions(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<RegionDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<RegionDTOV1[]>>>(environment.api.concat('/CatRegion/GetAll'), {
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize,
            },
        });
    }

    getRegionById(regionId: number): Observable<ResponseV1<RegionDTOV1>> {
        return this.http.get<ResponseV1<RegionDTOV1>>(environment.api.concat(`/CatRegion/GetById?id=${regionId}`));
    }

    createRegion(body: RegionDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatRegion/Add'), body);
    }

    updateRegion(body: RegionDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatRegion/Update'), body);
    }

    disbaleRegion(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<never>(environment.api.concat(`/CatRegion/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteRegion(regionId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatRegion/Delete/?id=${regionId}`));
    }

    getAllRegionsExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatRegion/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllRegionsExcel() {
        return environment.api.concat(`/Export/GetAll/Region`);
    }
}
