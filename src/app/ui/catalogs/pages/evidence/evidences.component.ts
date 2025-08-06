import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EvidencesCatalogService, LevelModalityService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { EvidenceDTO, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvidenceRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-evidences',
    templateUrl: './evidences.component.html',
    styleUrls: ['./evidences.component.scss'],
})
export class EvidencesComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: EvidenceDTO[];
    dataSource: MatTableDataSource<EvidenceDTO>;
    selection: SelectionModel<EvidenceDTO>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    evidencesRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly evidenceRecord: EvidenceRecordService,
        private readonly evidences: EvidencesCatalogService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<EvidenceDTO>([]);
        this.selection = new SelectionModel<EvidenceDTO>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.evidencesRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllEvidences(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editEvidence(evidence: EvidenceDTO): void {
        this.evidenceRecord
            .open({ data: evidence })
            .afterClosed()
            .subscribe((result) => {
                this.getAllEvidences(this.filters);
            });
    }

    deleteEvidenceByConfimation(region: EvidenceDTO): void {
        Alert.confirm('Eliminar la evidencia', `¿Deseas eliminar la evidencia?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteEvidence(region);
        });
    }

    openEvidenceRecord(): void {
        this.evidenceRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllEvidences(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllEvidences(this.filters);
    }

    private deleteEvidence(evidence: EvidenceDTO): void {
        this.evidences.deleteEvidence(evidence.id).subscribe(() => {
            this.basicNotification.notif("success",'Evidencia eliminada correctamente');
            this.paginator.firstPage();
            this.getAllEvidences(this.filters);
        });
    }

    disableEvidence(data: EvidenceDTO): void {
        const msg = `Evidencia ${data.activo ? 'inactivada' : 'activada'} correctamente`;
        this.evidences.disableEvidence(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllEvidences(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'activar' : 'desactivar'} la Evidencia`);
            }
        });
    }

    private getAllEvidences(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.evidences.getAllEvidence(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((evidence) => new EvidenceDTO().deserialize(evidence));
                console.log(this.data)
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    getAllEvidencesExcel(): void {
        this.evidences.getAllEvidencesExcel(this.filters).subscribe((response) => saveAs(response, 'Evidencias.xlsx'));
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //             descripcion: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllEvidences(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
                descripcion: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllEvidences(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }

    viewFileEvidence(file:any){
        this.evidences.GetAzureFile(file.archivoAzureId).subscribe((res:any) => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
            PDF_link.download = file.nombreFormato;
            PDF_link.click();
        });
    }

    DownloadFileEvidence(file:any){
        var fileExt = file.nombreFormato.split('.');
        if (fileExt.length > 1){
            this.evidences.GetAzureFile(file.archivoAzureId).subscribe((res:any) => {
                saveAs(res, file.nombreFormato);
            });
        }
    }

    canViewFile(file:any) : boolean{
        if(file.nombreFormato){
            if (file.nombreFormato.includes('.pdf')){
                return true;      
            }
        }
        return false
    }
    canDownloadFile(file:any) : boolean{
        if(file.nombreFormato){
            var fileExt = file.nombreFormato.split('.');
            if (fileExt.length < 2) // no tiene extension
            {
                return false;
            }
            if (!file.nombreFormato.includes('.pdf')){
                return true;      
            }
        }

        return false;
    }
}
