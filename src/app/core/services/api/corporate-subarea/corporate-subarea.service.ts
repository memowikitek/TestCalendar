import { SubAreaCorporativaDTOV1 } from './../../../../utils/models/subarea-corporativa.dto.v1';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CorporateSubAreaService {
    subAreaCorporateList: SubAreaCorporativaDTOV1[];
    constructor(private http: HttpClient) {
        this.subAreaCorporateList = [];
    }

    getAllCorporateSubAreas(
        filters: TablePaginatorSearch
    ): Observable<ResponseV1<PageResultV1<SubAreaCorporativaDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<SubAreaCorporativaDTOV1[]>>>(
            environment.api.concat('/CatSubAreaCentral/GetAll'),
            {
                params: {
                    filtro: JSON.stringify(filters.filter),
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                },
            }
        );
    }

    getUrlAllCorporateSubAreas() {
        return environment.api.concat(`/Export/GetAll/SubAreaCentral`);
    }

    getCoporateSubAreaById(areaCorporativaId: string | number): Observable<ResponseV1<SubAreaCorporativaDTOV1>> {
        return this.http.get<ResponseV1<SubAreaCorporativaDTOV1>>(
            environment.api.concat(`/CatSubAreaCentral/GetById?id=${areaCorporativaId}`)
        );
    }
    createCorporateSubArea(body: SubAreaCorporativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatSubAreaCentral/Add'), body);
    }

    updateCorporateSubArea(body: SubAreaCorporativaDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatSubAreaCentral/Update'), body);
    }

    disableCorpporateArea(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatSubAreaCentral/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteCorporateSubArea(areaCorporativaId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(
            environment.api.concat(`/CatSubAreaCentral/Delete/?id=${areaCorporativaId}`)
        );
    }

    getAllCorpoateSubAreaExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatSubAreaCentral/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllCorporateSubAreas(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllCorporateSubAreas(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new SubAreaCorporativaDTOV1().deserialize(item));
                    this.subAreaCorporateList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
