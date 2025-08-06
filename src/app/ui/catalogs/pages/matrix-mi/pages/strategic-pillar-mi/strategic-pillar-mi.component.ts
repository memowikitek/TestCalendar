import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PilarEstrategicoMiService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { PilarEstrategicoMIDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { ModuleIdV2 } from 'src/app/utils/enums/modules-idV2';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { PilarEstrategicoMiRecordService } from './modals';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-strategic-pillar-mi',
    templateUrl: './strategic-pillar-mi.component.html',
    styleUrls: ['./strategic-pillar-mi.component.scss'],
})
export class PilarEstrategicoMiComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    selection: SelectionModel<PilarEstrategicoMIDTOV1>;
    disabled: boolean;
    dataSource: MatTableDataSource<PilarEstrategicoMIDTOV1>;
    filters: TablePaginatorSearch;
    data: PilarEstrategicoMIDTOV1[];
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    pageIndex: number;
    pageSize: number;
    length: number;
    permissions: string[];
    strategicPilarRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly PilarEstrategicoMiRecordService: PilarEstrategicoMiRecordService,
        private readonly PilarEstrategicoMiService: PilarEstrategicoMiService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.dataSource = new MatTableDataSource<PilarEstrategicoMIDTOV1>([]);
        this.dataSource.filterPredicate = function (record: PilarEstrategicoMIDTOV1, filter: string): boolean {
            return (
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.descripcion.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.data = [];
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        this.strategicPilarRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllPilarEstrategicoMi(this.filters);

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
        this.getAllPilarEstrategicoMi(this.filters);
    }

    openStrategicPillarMiRecord(): void {
        this.PilarEstrategicoMiRecordService.open()
            .afterClosed()
            .subscribe(() => {
                this.getAllPilarEstrategicoMi(this.filters);
            });
    }

    editStrategicPillarMi(componente: PilarEstrategicoMIDTOV1): void {
        this.PilarEstrategicoMiRecordService.open({ data: componente })
            .afterClosed()
            .subscribe(() => this.getAllPilarEstrategicoMi(this.filters));
    }

    disableStrategicPillarMi(data: PilarEstrategicoMIDTOV1): void {
        const msg = `Pilar Estratégico ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.PilarEstrategicoMiService.disableStrategicPillarMi(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllPilarEstrategicoMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Pilar Estratéico`);
            }
        });
    }

    deleteStrategicPillarMiByConfimation(componente: PilarEstrategicoMIDTOV1): void {
        Alert.confirm('Eliminar Pilar Estratégico', `¿Deseas eliminar el Pilar Estratégico?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteStrategicPillarMi(componente);
        });
    }

    getAllStrategicPillarMiExcel(): void {
        this.PilarEstrategicoMiService.getAllStrategicPillarMiExcel(this.filters).subscribe((response) =>
            saveAs(response, 'PilarEstrategicoMI.xlsx')
        );
    }

    private getAllPilarEstrategicoMi(filter: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.PilarEstrategicoMiService.getAllStrategicPillarMi(filter).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((componente) => new PilarEstrategicoMIDTOV1().deserialize(componente));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    private deleteStrategicPillarMi(componente: PilarEstrategicoMIDTOV1): void {
        this.PilarEstrategicoMiService.deleteStrategicPillarMi(componente.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Pilar Estratégico eliminado correctamente');
                this.paginator.firstPage();
                this.getAllPilarEstrategicoMi(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar el Pilar Estratégico');
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
    //         this.getAllPilarEstrategicoMi(this.filters);
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
            this.getAllPilarEstrategicoMi(this.filters);
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
