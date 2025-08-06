import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    AreaCorporativaDTO,
    AreaCorporativaDTOV1,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CorporateAreaService {
    corporateAreaList: AreaCorporativaDTOV1[];
    constructor(private http: HttpClient) {
        this.corporateAreaList = [];
    }

    getAllCorporateAreas(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<AreaCorporativaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<AreaCorporativaDTOV1[]>>>(
//            environment.api.concat('/CatAreaCorporativa/GetAll'),
            environment.api.concat('/CatAreaCentral/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getUrlAllCorporateAreas() {
        return environment.api.concat(`/Export/GetAll/AreaCorporativa`);
    }

    getCoporateAreaById(areaCorporativaId: string | number): Observable<ResponseV1<AreaCorporativaDTOV1>> {
        return this.http.get<ResponseV1<AreaCorporativaDTOV1>>(
            environment.api.concat(`/CatAreaCentral/GetById?id=${areaCorporativaId}`)
        );
    }
    createCorporateArea(body: AreaCorporativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatAreaCentral/Add'), body);
    }

    updateCorporateArea(body: AreaCorporativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatAreaCentral/Update'), body);
    }

    disableCorpporateArea(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatAreaCentral/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteCorporateArea(areaCorporativaId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatAreaCentral/Delete/?id=${areaCorporativaId}`));
    }

    getAllCorpoateAreaExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatAreaCentral/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllCorporateAreas(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllCorporateAreas(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new AreaCorporativaDTOV1().deserialize(item));
                    this.corporateAreaList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
