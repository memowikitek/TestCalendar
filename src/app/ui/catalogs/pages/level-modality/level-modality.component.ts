import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { LevelModalityService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { NivelModalidadDTO, NivelModalidadDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { LevelModalityRecordService } from './modals';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-level-modality',
    templateUrl: './level-modality.component.html',
    styleUrls: ['./level-modality.component.scss'],
    standalone: false
})
export class LevelModalityComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    data: NivelModalidadDTOV1[];
    dataSource: MatTableDataSource<NivelModalidadDTOV1>;
    selection: SelectionModel<NivelModalidadDTOV1>;
    pageIndex: number;
    pageSize: number;
    length: number;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    levelModalityRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly levelModalityRecord: LevelModalityRecordService,
        private readonly levelModality: LevelModalityService,
        private users: UsersService,
        private basicNotification : BasicNotification,
        private readonly formBuilder: FormBuilder,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<NivelModalidadDTOV1>([]);
        this.selection = new SelectionModel<NivelModalidadDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.filters = new TablePaginatorSearch();
        this.thisAccess = new Vista();
        this.permissions = [];

        
        this.levelModalityRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllLevelModality(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    editLevelModality(levelModality: NivelModalidadDTOV1): void {
        this.levelModalityRecord
            .open({ data: levelModality })
            .afterClosed()
            .subscribe(() => this.getAllLevelModality(this.filters));
    }

    disableLevelModality(data: NivelModalidadDTOV1): void {
        const msg = `Nivel/Modalidad ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.levelModality.disableLevelModality(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllLevelModality(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Área Responsable`);
            }
        });
    }

    deleteLevelModalityByConfimation(levelModality: NivelModalidadDTOV1): void {
        Alert.confirm('Eliminar Nivel/Modalidad', `¿Deseas eliminar el Nivel/Modalidad?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteLevelModality(levelModality);
        });
    }

    openLevelModalityRecord(): void {
        this.levelModalityRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllLevelModality(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllLevelModality(this.filters);
    }

    getAllLevelModalityExcel(): void {
        this.levelModality
            .getUrlAllLevelModalityExcel(this.filters)
            .subscribe((response) => saveAs(response, 'NivelesModalidad.xlsx'));
    }

    private deleteLevelModality(levelModality: NivelModalidadDTOV1): void {
        this.levelModality.deleteLevelModality(levelModality.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Nivel/Modalidad eliminado correctamente');
                this.getAllLevelModality(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error", 'No se puede eliminar el Nivel/Modalidad');
            }
        });
    }

    private getAllLevelModality(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.levelModality.getAllLevelModality(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((levelModality) =>
                    new NivelModalidadDTOV1().deserialize(levelModality)
                );
                console.log("Filtros: ", this.data);
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 1 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             clave: filterValue.trim().toLowerCase(),
    //             descripcion: filterValue.trim().toLowerCase(),
                
    //         };
    //         this.filters.pageNumber = 0;
    //         this.pageIndex = this.filters.pageNumber;
    //         this.getAllLevelModality(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 1 || filterValue.length == 0) {
            this.filters.filter = {
                clave: filterValue.trim().toLowerCase(),
                descripcion: filterValue.trim().toLowerCase(),
                
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllLevelModality(this.filters);
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
