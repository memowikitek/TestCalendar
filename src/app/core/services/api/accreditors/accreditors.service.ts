import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    AcreditadoraDTOV1,
    AcreditadoraProcesoDTOV1,
    PageResult,
    PageResultV1,
    TablePaginatorSearch,
} from 'src/app/utils/models';
import { FileResponse, Response, ResponseV1 } from 'src/app/utils/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AccreditorsService {
    accreditorsList: AcreditadoraDTOV1[];
    proccessList: AcreditadoraProcesoDTOV1[];

    constructor(private http: HttpClient) {
        this.accreditorsList = [];
        this.proccessList = [];
    }

    getAllAccreditors(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<AcreditadoraDTOV1[]>>> {
        return this.http.get<ResponseV1<PageResultV1<AcreditadoraDTOV1[]>>>(
            environment.api.concat('/Acreditadora/GetAll'),
            {
                params: {
                    pageNumber: filters.pageNumber,
                    pageSize: filters.pageSize,
                    filtro: filters.search,
                },
            }
        );
    }

    getAllAccreditorsProccess(filters: TablePaginatorSearch): Observable<ResponseV1<AcreditadoraProcesoDTOV1[]>> {
        return this.http.get<ResponseV1<AcreditadoraProcesoDTOV1[]>>(
            environment.api.concat(`/AcreditadoraProceso/GetAll`),
            {
                params: {
                    pageNumber: filters.pageNumber,
                    pageSize: filters.pageSize,
                    filtro: JSON.stringify(filters.filter),
                },
            }
        );
    }

    getAccreditorsProccessById(accreditorId: number): Observable<ResponseV1<AcreditadoraProcesoDTOV1>> {
        return this.http.get<ResponseV1<AcreditadoraProcesoDTOV1>>(
            environment.api.concat(`/AcreditadoraProceso/GetById?idAcreditadora=${accreditorId}`)
        );
    }

    getAllAccreditorsExcel(filters: TablePaginatorSearch): Observable<FileResponse> {
        return this.http.get<FileResponse>(environment.api.concat('/Acreditadora/Excel/Descarga'), {
            params: {
                ordenar: filters.orderBy,
                dir: filters.dir,
                filtro: filters.search,
                inactivos: filters.inactives,
            },
        });
    }

    getUrlAllAccreditorsExcel() {
        return environment.api.concat(`/Export/GetAll/InstitucionesAcreditadoras`);
    }

    async setAllAccreditors(filters: TablePaginatorSearch): Promise<void> {
        return new Promise((resolve) => {
            this.getAllAccreditors(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new AcreditadoraDTOV1().deserialize(item));
                    this.accreditorsList = data.filter((item) => item.activo === true);
                }
                resolve();
            });
        });
    }

    async setAllAccreditorsProccess(accreditorId: number): Promise<void> {
        const filters = new TablePaginatorSearch();
        filters.filter = { acreditadoraId: accreditorId };
        filters.pageSize = 1000;
        filters.pageNumber = 0;

        return new Promise((resolve) => {
            this.getAllAccreditorsProccess(filters).subscribe((response) => {
                if (response.output) {
                    const data = response.output.map((item) => new AcreditadoraProcesoDTOV1().deserialize(item));
                    this.proccessList = data;
                }
                resolve();
            });
        });
    }
}
