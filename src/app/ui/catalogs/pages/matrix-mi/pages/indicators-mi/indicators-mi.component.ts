import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { IndicatorService, IndicatorMiService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { IndicadorMIDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { IndicatorMiRecordService } from './modals';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-indicators-mi',
    templateUrl: './indicators-mi.component.html',
    styleUrls: ['./indicators-mi.component.scss'],
})
export class IndicatorsMiComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    selection: SelectionModel<IndicadorMIDTOV1>;
    disabled: boolean;
    dataSource: MatTableDataSource<IndicadorMIDTOV1>;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    data: IndicadorMIDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    indicatorsMiRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private users: UsersService,
        private readonly IndicatorMiRecordService: IndicatorMiRecordService,
        private readonly indicatorService: IndicatorMiService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.dataSource = new MatTableDataSource<IndicadorMIDTOV1>([]);
        this.dataSource.filterPredicate = function (record: IndicadorMIDTOV1, filter: string): boolean {
            return (
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.componenteMi.nombre.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.indicatorsMiRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
          
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllIndicatorMi(this.filters);

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
        this.getAllIndicatorMi(this.filters);
    }

    openIndicatorMiRecordService(): void {
        this.IndicatorMiRecordService.open()
            .afterClosed()
            .subscribe(() => {
                this, this.getAllIndicatorMi(this.filters);
            });
    }

    editIndicatorMiRecordService(indicador: IndicadorMIDTOV1): void {
        this.IndicatorMiRecordService.open({ data: indicador })
            .afterClosed()
            .subscribe(() => {
                this.getAllIndicatorMi(this.filters);
            });
    }

    deleteIndicadorMiByConfimation(indicador: IndicadorMIDTOV1): void {
        Alert.confirm('Eliminar Indicador MI', `¿Deseas eliminar el componente?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteIndicatorMi(indicador);
        });
    }

    getAllIndicatorExcel(): void {
        this.indicatorService
            .getAllIndicatorsMiExcel(this.filters)
            .subscribe((response) => saveAs(response, 'IndicadoresMI.xlsx'));
    }

    private getAllIndicatorMi(filter: TablePaginatorSearch) {
        this.dataSource.data = [];
        this.data = [];
        this.indicatorService.getAllIndicatorMi(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((indicador) => new IndicadorMIDTOV1().deserialize(indicador));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private deleteIndicatorMi(indicador: IndicadorMIDTOV1): void {
        this.indicatorService.deleteIndicatorMi(indicador.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Indicador MI eliminado correctamente');
                this.paginator.firstPage();
                this.getAllIndicatorMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el Indicador MI');
            }
        });
    }

    // applyFilter(event: Event) {
        
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 1 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.paginator.firstPage();
    //         this.getAllIndicatorMi(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 1 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllIndicatorMi(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    disableIndicatorMi(data: IndicadorMIDTOV1): void {
        const msg = `Indicador MI ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.indicatorService.disableIndicatorMi(data.id, !data.activo).subscribe((response) => {
            // console.log(response);
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllIndicatorMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Indicador MI`);
            }
        });
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }
}
