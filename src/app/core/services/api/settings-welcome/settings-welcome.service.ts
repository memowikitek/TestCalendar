import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseV1 } from 'src/app/utils/interfaces';
import { ListaArchivosModuloBienvenida, ListFilesByIdDTO, SettingsWelcomeDTO, SettingsWelcomeDTO1, PageResultV1, TablePaginatorSearch } from 'src/app/utils/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export default class SettingsWelcomeService {
    constructor(private http: HttpClient) {}

    getConfigPantallaBienvenida(): Observable<ResponseV1<SettingsWelcomeDTO>> {
        return this.http.get<ResponseV1<SettingsWelcomeDTO>>(environment.api.concat(`/Bienvenida/GetAll`));
    }

    getAllConfigPantallaBienvenida(filters: TablePaginatorSearch): Observable<ResponseV1<PageResultV1<SettingsWelcomeDTO[]>>> {
        return this.http.get<ResponseV1<PageResultV1<SettingsWelcomeDTO[]>>>(environment.api.concat(`/Bienvenida/GetAll`),{
            params: {
                filtro: JSON.stringify(filters.filter),
                pageNumber: filters.pageNumber,
                pageSize: filters.pageSize
            }
        });
    }

    createPantallaBienvenida(body: SettingsWelcomeDTO1): Observable<ResponseV1<never>> {
        return this.http.post<ResponseV1<never>>(environment.api.concat('/Bienvenida/Add'), body);
    }

    updatePantallaBienvenida(body: SettingsWelcomeDTO): Observable<ResponseV1<never>> {
        return this.http.put<ResponseV1<never>>(environment.api.concat('/Bienvenida/Update'), body);
    }

    /**FILES */
    getArchivosAzureById(Id: number): Observable<ResponseV1<ListFilesByIdDTO>>{
        return this.http.get<ResponseV1<ListFilesByIdDTO>>(environment.api.concat(`/Bienvenida/GetArchivosAzureById?id=${Id}`),{});
    }

    getListFilesWelcomeModule(): Observable<ResponseV1<ListaArchivosModuloBienvenida>> {
        return this.http.get<ResponseV1<ListaArchivosModuloBienvenida>>(
            environment.api.concat('/AzureStorage/ListFilesWelcomeModule'),
            {}
        );
    }

    downloadAzureStorageFile(id: string) {
        return this.http.get(environment.api.concat(`/AzureStorage/DownloadFromWelcomeModule/${id}`), {
            responseType: 'blob',
        });
    }

    //Subir Imagen para Ciclo
    async uploadAzureStorageFile(body: FormData) {
        const response = await this.http
            .post<ResponseV1<never>>(environment.api.concat('/AzureStorage/UploadFromWelcomeModule'), body)
            .toPromise();
        return response;
    }

    async deleteAzureStorageFile(id: string): Promise<ResponseV1<never>> {
        const response = await this.http
            .delete<ResponseV1<never>>(environment.api.concat(`/AzureStorage/DeleteFromWelcomeModule?blobFilename=${id}`))
            .toPromise();
        return response;
    }

    //Subir Formato PM para Ciclo
    async uploadAzureStorageFileFPM(body: FormData) {
        const response = await this.http
            .post<ResponseV1<never>>(environment.api.concat('/AzureStorage/UploadFpm'), body)
            .toPromise();
        return response;
    }

    async deleteAzureStorageFileFPM(id: string): Promise<ResponseV1<never>> {
        const response = await this.http
            .delete<ResponseV1<never>>(environment.api.concat(`/AzureStorage/DeleteFile/${id}/formato-plan-mejora`))
            .toPromise();
        return response;
    }
}
