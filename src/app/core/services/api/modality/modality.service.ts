import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { ModalidadDTOV1, PageResult, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ModalityService {
    list: ModalidadDTOV1[];

    constructor(private http: HttpClient) {
        this.list = [];
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

    getModalityById(ModalityId: number): Observable<ResponseV1<ModalidadDTOV1>> {
        return this.http.get<ResponseV1<ModalidadDTOV1>>(
            environment.api.concat(`/CatModalidad/GetById?id=${ModalityId}`)
        );
    }

    createModality(body: ModalidadDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/CatModalidad/Add'), body);
    }

    updateModality(body: ModalidadDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/CatModalidad/Update/'), body);
    }

    disableModality(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/CatModalidad/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteModality(ModalityId: number): Observable<never> {
        return this.http.delete<never>(environment.api.concat(`/CatModalidad/Delete?id=${ModalityId}`));
    }

    getAllModalityExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/CatModalidad/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    async setAllModality(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllModality(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new ModalidadDTOV1().deserialize(item));
                    this.list = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
