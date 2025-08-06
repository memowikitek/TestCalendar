import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ComponentsService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { ComponenteDTO, ComponenteDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ComponentsRecordService } from './modals/component-record/component-record.service';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: ComponenteDTOV1[];
    dataSource: MatTableDataSource<ComponenteDTOV1>;
    selection: SelectionModel<ComponenteDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    componentsRecordForm: FormGroup;
    permissions: string[];

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly componentRecord: ComponentsRecordService,
        private readonly components: ComponentsService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<ComponenteDTOV1>([]);
        this.dataSource.filterPredicate = function (record: ComponenteDTOV1, filter: string): boolean {
            return (
                record.clave.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<ComponenteDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.componentsRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllComponents(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    openComponentRecord(): void {
        this.componentRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllComponents(this.filters));
    }

    editComponent(componente: ComponenteDTOV1): void {
        this.componentRecord
            .open({ data: componente })
            .afterClosed()
            .subscribe(() => this.getAllComponents(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllComponents(this.filters);
    }

    closeComponentsRecord(): void {
        this.componentRecord.open().afterClosed();
    }

    private getAllComponents(filter: TablePaginatorSearch) {
        this.dataSource.data = [];
        this.data = [];
        this.components.getAllComponents(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((componente) => new ComponenteDTOV1().deserialize(componente));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    deleteComponentByConfimation(components: ComponenteDTOV1): void {
        Alert.confirm('Eliminar componente', `¿Deseas eliminar el componente?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteComponent(components);
        });
    }

    disableComponent(data: ComponenteDTOV1): void {
        const msg = `Componente ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.components.disableComponent(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllComponents(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("success", `No se puede ${!data.activo ? 'inactivar' : 'activar'} el Componente`);
            }
        });
    }

    private deleteComponent(component: ComponenteDTOV1): void {
        this.components.deleteComponent(component.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Componente eliminado correctamente');
                this.paginator.firstPage();
                this.getAllComponents(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el Componente');
            }
        });
    }

    getAllComponentsExcel(): void {
        this.components
            .getAllComponentsExcel(this.filters)
            .subscribe((response) => saveAs(response, 'Componentes.xlsx'));
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllComponents(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }
    applyFilter(filterValue: any) {
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllComponents(this.filters);
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
