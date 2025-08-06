import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import {
    ModalidadDTOV1,
    NivelDTOV1,
    //NivelModalidadDTO,
    NivelModalidadDTOV1,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LevelModalityService {
    list: NivelModalidadDTOV1[];

    constructor(private http: HttpClient) {
        this.list = [];
    }

    getAllLevelModality(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<NivelModalidadDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<NivelModalidadDTOV1[]>>>(
            environment.api.concat('/CatNivelModalidad/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getAllLevel(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<NivelDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<NivelDTOV1[]>>>(environment.api.concat('/CatNivel/GetAll'), {
            params: {
                pageSize: filters.pageSize,
                pageNumber: filters.pageNumber,
                filtro: JSON.stringify(filters.filter),
            },
        });
    }

    getAllModality(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<ModalidadDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<ModalidadDTOV1[]>>>(
            environment.api.concat('/CatModalidad/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getByAreaResponsable(idAreaResponsable: number): Observable<ResponseV1<PageResultV1<NivelModalidadDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<NivelModalidadDTOV1[]>>>(
            environment.api.concat(`/CatNivelModalidad/GetByAreaResponsable?idAreaResponsable=${idAreaResponsable}`)
            // ,{
            //     params: {
            //         pageSize: filters.pageSize,
            //         pageNumber: filters.pageNumber,
            //         filtro: JSON.stringify(filters.filter),
            //     },
            // }
        );
    }

    getLevelModalityById(levelModalityId: number): Observable<ResponseV1<NivelModalidadDTOV1>> {
        return this.http.get<ResponseV1<NivelModalidadDTOV1>>(
            environment.api.concat(`/CatNivelModalidad/GetById?id=${levelModalityId}`)
        );
    }

    createLevelModality(body: NivelModalidadDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatNivelModalidad/Add'), body);
    }

    updateLevelModality(body: NivelModalidadDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatNivelModalidad/Update/'), body);
    }

    disableLevelModality(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatNivelModalidad/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteLevelModality(levelModalityId: number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/CatNivelModalidad/Delete?id=${levelModalityId}`));
    }

    getUrlAllLevelModalityExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatNivelModalidad/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllLevelModality(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.filter = { activo: true };
        filters.pageSize = 999999;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllLevelModality(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new NivelModalidadDTOV1().deserialize(item));
                    // this.list = data.filter((item) => item.activo === true);
                    this.list = data;
                }
                resolve();
            });
        });
    }
}
