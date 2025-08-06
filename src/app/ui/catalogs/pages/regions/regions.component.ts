import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { RegionsService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { ModulesCatalog, RegionDTO, RegionDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { RegionRecordService } from './modals';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-regions',
    templateUrl: './regions.component.html',
    styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: RegionDTOV1[];
    dataSource: MatTableDataSource<RegionDTOV1>;
    selection: SelectionModel<RegionDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];
    regionsRecordForm: FormGroup;

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly regionRecord: RegionRecordService,
        private readonly regions: RegionsService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<RegionDTOV1>([]);
        this.dataSource.filterPredicate = function (record: RegionDTOV1, filter: string): boolean {
            return (
                record.clave.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                record.directorRegional.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<RegionDTOV1>(true);
        this.disabled = null;
        this.permissions = [];
        this.filters = new TablePaginatorSearch();

        this.regionsRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllRegions(this.filters);
        //  fromEvent(this.inputSearch.nativeElement, 'keyup')
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

    editRegion(region: RegionDTOV1): void {
        this.regionRecord
            .open({ data: region })
            .afterClosed()
            .subscribe((result) => {
                this.getAllRegions(this.filters);
            });
    }

    deleteRegionByConfimation(region: RegionDTOV1): void {
        Alert.confirm('Eliminar la Región', `¿Deseas eliminar la Región?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteRegion(region);
        });
    }

    disableRegion(region: RegionDTOV1): void {
        const msg = `Región ${region.activo ? 'inactivada' : 'activada'} correctamente`;
        this.regions.disbaleRegion(region.id, !region.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllRegions(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!region.activo ? 'inactivar' : 'activar'} la Región`);
            }
        });
    }

    openRegionRecord(): void {
        this.regionRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllRegions(this.filters));
    }

    search(term: string): void {
        this.dataSource.filter = term;
        this.paginator.pageIndex = 0;
        this.dataSource.paginator = this.paginator;
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllRegions(this.filters);
    }

    getAllRegionsExcel(): void {
        this.regions.getAllRegionsExcel(this.filters).subscribe((response) => saveAs(response, 'Regiones.xlsx'));
    }

    private deleteRegion(region: RegionDTOV1): void {
        this.regions.deleteRegion(region.id).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",'Región eliminada correctamente');
                this.filters.pageNumber = 0;
                this.paginator.firstPage();
                this.getAllRegions(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",'No se puede eliminar la Región');
            }
        });
    }

    private getAllRegions(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        this.regions.getAllRegions(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((region) => new RegionDTOV1().deserialize(region));
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
    //         this.filters.pageNumber = 0;
    //         this.pageIndex = this.filters.pageNumber;
    //         this.getAllRegions(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllRegions(this.filters);
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

}
