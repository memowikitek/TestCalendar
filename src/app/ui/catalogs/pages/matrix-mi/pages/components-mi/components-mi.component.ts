import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ComponentMiService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { ComponenteMIDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ComponentMiRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-components-mi',
    templateUrl: './components-mi.component.html',
    styleUrls: ['./components-mi.component.scss'],
})
export class ComponentsMiComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    selection: SelectionModel<ComponenteMIDTOV1>;
    dataSource: MatTableDataSource<ComponenteMIDTOV1>;
    filters: TablePaginatorSearch;
    data: ComponenteMIDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    pageIndex: number;
    pageSize: number;
    length: number;
    disabled: boolean;
    permissions: string[];
    componentMiRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly ComponentMiRecordService: ComponentMiRecordService,
        private readonly ComponentMiService: ComponentMiService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.dataSource = new MatTableDataSource<ComponenteMIDTOV1>([]);
        this.dataSource.filterPredicate = function (record: ComponenteMIDTOV1, filter: string): boolean {
            return (
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.descripcion.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];
        
        
this.componentMiRecordForm = this.formBuilder.group({
    busqueda: [null],
    

  }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllComponentsMi(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllComponentsMi(this.filters);
    }

    openComponentMiRecord(): void {
        this.ComponentMiRecordService.open()
            .afterClosed()
            .subscribe(() => {
                this.getAllComponentsMi(this.filters);
            });
    }

    editComponentMiRecord(componente: ComponenteMIDTOV1): void {
        // console.log("componente MI: " + JSON.stringify(componente));
        this.ComponentMiRecordService.open({ data: componente })
            .afterClosed()
            .subscribe(() => this.getAllComponentsMi(this.filters));
    }

    disableComponentMi(data: ComponenteMIDTOV1): void {
        const msg = `Componente MI ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.ComponentMiService.disableComponentMi(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllComponentsMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Pilar Estratéico`);
            }
        });
    }

    deleteComponentMiByConfimation(componente: ComponenteMIDTOV1): void {
        Alert.confirm('Eliminar componente MI', `¿Deseas eliminar el componente?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteComponentMi(componente);
        });
    }

    getAllCompononentMiExcel(): void {
        this.ComponentMiService.getAllComponentMiExcel(this.filters).subscribe((response) =>
            saveAs(response, 'ComponentesMI.xlsx')
        );
    }

    private getAllComponentsMi(filter: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.ComponentMiService.getAllComponentMi(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((componente) => new ComponenteMIDTOV1().deserialize(componente));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private deleteComponentMi(componente: ComponenteMIDTOV1): void {
        this.ComponentMiService.deleteComponentMi(componente.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Componente MI eliminado correctamente');
                this.paginator.firstPage();
                this.getAllComponentsMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el Componente');
            }
        });
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //             descripcion: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllComponentsMi(this.filters);
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
            this.getAllComponentsMi(this.filters);
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
