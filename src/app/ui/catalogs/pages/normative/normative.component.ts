import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NormativeService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { NormativaDTO, NormativaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { NormativeRecordService } from './modals/normative-record/normative-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-normative',
    templateUrl: './normative.component.html',
    styleUrls: ['./normative.component.scss'],
})
export class NormativeComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: NormativaDTOV1[];
    dataSource: MatTableDataSource<NormativaDTOV1>;
    selection: SelectionModel<NormativaDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    normativeRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly normativaRecord: NormativeRecordService,
        private readonly normative: NormativeService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<NormativaDTOV1>([]);
        this.dataSource.filterPredicate = function (record: NormativaDTOV1, filter: string): boolean {
            return (
                record.clave.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<NormativaDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.normativeRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllNormatives(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    openNormativeRecord(): void {
        this.normativaRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllNormatives(this.filters));
    }

    editNormative(normativa: NormativaDTOV1): void {
        this.normativaRecord
            .open({ data: normativa })
            .afterClosed()
            .subscribe(() => this.getAllNormatives(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllNormatives(this.filters);
    }

    private getAllNormatives(filter: TablePaginatorSearch) {
        this.dataSource.data = [];
        this.data = [];
        this.normative.getAllNormatives(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((normativa) => new NormativaDTOV1().deserialize(normativa));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    deleteNormativeByConfimation(normativa: NormativaDTOV1): void {
        Alert.confirm('Eliminar normativa', `¿Deseas eliminar la normativa?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteNormative(normativa);
        });
    }

    disableNormative(data: NormativaDTOV1): void {
        const msg = `Normativa ${data.activo ? 'inactivada' : 'activada'} correctamente`;
        this.normative.disableNormative(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllNormatives(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} la Normativa`);
            }
        });
    }

    getAllNormativesExcel(): void {
        this.normative.getAllNormativesExcel(this.filters).subscribe((response) => saveAs(response, 'Normativa.xlsx'));
    }

    private deleteNormative(normativa: NormativaDTOV1): void {
        this.normative.deleteNormative(normativa.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Normativa eliminada correctamente');
                this.paginator.firstPage();
                this.getAllNormatives(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("success",'No se puede eliminar la Normativa');
            }
        });
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllNormatives(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllNormatives(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }
}
