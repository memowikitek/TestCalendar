import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InstitutionService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { ModulesCatalog, InstitucionDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { InstitutionRecordService } from './modals';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.scss'],
})
export class InstitutionsComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: InstitucionDTOV1[];
    dataSource: MatTableDataSource<InstitucionDTOV1>;
    selection: SelectionModel<InstitucionDTOV1>;
    disabled: boolean;
    permission: boolean;
    pageIndex: number;
    pageSize: number;
    length: number;
    filters: TablePaginatorSearch;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    institutionsRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly institutionRecord: InstitutionRecordService,
        private readonly institutions: InstitutionService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,

    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<InstitucionDTOV1>([]);
        this.dataSource.filterPredicate = function (record: InstitucionDTOV1, filter: string): boolean {
            return record.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.selection = new SelectionModel<InstitucionDTOV1>(true);
        this.disabled = null;
        this.thisAccess = new Vista();
        this.permissions = [];
        this.filters = new TablePaginatorSearch();

        this.institutionsRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        
        this.getAllInstitutions(this.filters);
        // fromEvent(this.inputSearch.nativeElement, 'keyup')
        //     .pipe(
        //         map((event: any) => event.target.value),
        //         debounceTime(1000),
        //         distinctUntilChanged()
        //     )
        //     .subscribe((text: string) => {
        //         this.search(text);
        //     });

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editInstitution(institution: InstitucionDTOV1): void {
        this.institutionRecord
            .open({ data: institution })
            .afterClosed()
            .subscribe((result) => {
                this.getAllInstitutions(this.filters);
            });
    }

    openInstitutionRecord(): void {
        this.institutionRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllInstitutions(this.filters));
    }

    search(term: string): void {
        this.dataSource.filter = term;
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllInstitutions(this.filters);
    }

    getAllInstitutionsExcel(): void {
        this.institutions
            .getAllInstitutionsExcel(this.filters)
            .subscribe((response) => saveAs(response, 'Instituciones.xlsx'));
    }

    deleteInstitution(institution: InstitucionDTOV1): void {
        Alert.confirm('Eliminar la Institución', '¿Deseas eliminar esta Institución?').subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.institutions.deleteInstitution(institution.id).subscribe((response) => {
                if (response.exito) {
                    this.basicNotification.notif("success", 'Institución eliminada correctamente');
                    this.getAllInstitutions(this.filters);
                } else {
                    console.error(response.mensaje);
                    this.basicNotification.notif("error",'No se puede eliminar la Institución');
                }
            });
        });
    }

    disableInstitution(data: InstitucionDTOV1): void {
        const msg = `Institución ${data.activo ? 'inactivada' : 'activada'} correctamente`;
        this.institutions.disableInstitution(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllInstitutions(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} la Institución`);
            }
        });
    }

    getAllInstitutions(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.institutions.getAllInstitutions(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((institution) => new InstitucionDTOV1().deserialize(institution));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllInstitutions(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllInstitutions(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

}
