import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { TablePaginatorSearch, PageResult, PageResultV1, SubIndicadorMIDTOV1 } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SubindicatorMiService {
    subIndicatorMiList: SubIndicadorMIDTOV1[];

    constructor(private http: HttpClient) {
        this.subIndicatorMiList = [];
    }
    getAllSubIndicatorMi(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<SubIndicadorMIDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<SubIndicadorMIDTOV1[]>>>(
            environment.api.concat('/SubIndicadorMI/GetAll'),
            {
                params: {
                    pageSize: filters.pageSize,
                    pageNumber: filters.pageNumber,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getSubIndicatorMiById(SubIndicadorMIId: string | number): Observable<ResponseV1<SubIndicadorMIDTOV1>> {
        return this.http.get<ResponseV1<SubIndicadorMIDTOV1>>(
            environment.api.concat(`/SubIndicadorMI/GetById?id=${SubIndicadorMIId}`)
        );
    }

    createSubIndicatortMi(body: SubIndicadorMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/SubIndicadorMI/Add'), body);
    }

    updateSubIndicatorMi(body: SubIndicadorMIDTOV1): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/SubIndicadorMI/Update'), body);
    }

    disbaleSubIndicatorMi(id: number, disable: boolean): Observable<ResponseV1<never>> {
        return this.http.patch<ResponseV1<never>>(environment.api.concat(`/SubIndicadorMI/Disable`), {
            id: id,
            activo: disable,
        });
    }

    deleteSubIndicatorMi(SubIndicadorMIId: string | number): Observable<ResponseV1<never>> {
        return this.http.delete<never>(environment.api.concat(`/SubIndicadorMI/Delete?id=${SubIndicadorMIId}`));
    }

    getAllSubIndicatorMiExcel(filters: TablePaginatorSearch) {
        return this.http.get(environment.api.concat('/SubIndicadorMI/ExcelDescarga'), {
            params: {
                filtro: JSON.stringify(filters.filter),
            },
            responseType: 'blob',
        });
    }

    getUrlAllSubIndicatorMiExcel() {
        return environment.api.concat(`/Export/GetAll/SubIndicadorMI`);
    }

    async setAllSubIndicatorsMi(): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.inactives = true;
        filters.pageSize = -1;
        filters.pageNumber = 1;

        return new Promise((resolve) => {
            this.getAllSubIndicatorMi(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new SubIndicadorMIDTOV1().deserialize(item));
                    this.subIndicatorMiList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }
}
