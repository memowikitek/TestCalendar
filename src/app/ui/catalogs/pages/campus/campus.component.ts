import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CampusService, UsersService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { CampusDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CampusRecordService } from './modals/campus-record/campus-record.service';
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { saveAs } from 'file-saver';
import { BasicNotification } from '../../../../utils/helpers/basicNotification';
import { SidenavService } from '../../../dashboard/menu-mat/sidenav.service';

export class ParamsModel {
    regionesId: any[] | null;
    institucionesId: any[] | null;
    activo: boolean[] | null;
}

@Component({
    selector: 'app-campus',
    templateUrl: './campus.component.html',
    styleUrls: ['./campus.component.scss'],
    standalone: false
})
export class CampusComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    private searchSubject: Subject<string> = new Subject<string>();
    data: any[] = [];
    dataSource: MatTableDataSource<CampusDTOV1> = new MatTableDataSource<CampusDTOV1>([]);
    selection: SelectionModel<CampusDTOV1> = new SelectionModel<CampusDTOV1>(true);
    disabled: boolean = null;
    permission: boolean = null;
    filters: TablePaginatorSearch = new TablePaginatorSearch();
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista = new Vista();
    thisModule: ModulesCatalogDTO;
    permissions: string[] = [];
    columns: string[] = ['institucion','clave', 'name', 'select', 'edit'];
    
    //Campos
    inputCampus: any;
    inputAreaResp: any;
    inputRegion: any;
    inputInstitucion: any;
    inputEstatus: any;
    //
    cc:any;

    constructor(
        private router: Router,
        private readonly campusRecord: CampusRecordService,
        private readonly campus: CampusService,
        private users: UsersService,
        private basicNotification: BasicNotification,
        private sidenavService: SidenavService,
        private access : Vista,
    ) {
        this.searchSubject
            .pipe(
                debounceTime(500),
                map((filterValue) => filterValue.trim().toLowerCase()) // Realiza la transformación aquí
            )
            .subscribe((filterValue) => {
                this.applyFilter(filterValue);
            });
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllCampus(this.filters);
    }

    editCampus(campus: CampusDTOV1): void {
        this.campusRecord
            .open({ data: campus })
            .afterClosed()
            .subscribe(() => this.getAllCampus(this.filters));
    }

    onChange($event: any, id: number) {}

    deleteCampusByConfimation(campus: CampusDTOV1): void {
        Alert.confirm('Eliminar el Campus', '¿Deseas eliminar este Campus?').subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.campus.deleteCampus(campus.id).subscribe((response) => {
                if (response.exito) {
                    this.basicNotification.notif('success', 'Campus eliminado correctamente');
                    this.paginator.firstPage();
                    this.getAllCampus(this.filters);
                } else {
                    console.error(response.mensaje, response.output);
                    this.basicNotification.notif('error', 'No se puede eliminar el Campus');
                    
                }
            });
        });
    }

    disableCampus(data: CampusDTOV1): void {
        const msg = `Campus ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.campus.disableCampus(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif('success', msg);
                this.getAllCampus(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif('error', `No se puede ${!data.activo ? 'Deshabilitar' : 'Habilitar'} el Campus`);
            }
        });
    }

    openCampusRecord(): void {
        this.campusRecord
            .open()
            //.updateSize('15vw')
            .afterClosed()
            .subscribe(() => this.getAllCampus(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllCampus(this.filters);
    }

    getAllCampusExcel(): void {
        this.campus.getAllCampusExcel(this.filters).subscribe((response) => saveAs(response, 'Campus.xlsx'));
    }

    private getAllCampus(filters: TablePaginatorSearch): void {
        //todo j031 240403, ajustar por cambio de apppResult
        this.dataSource.data = [];
        this.campus.getAllCampusFilter(filters).subscribe((response) => { //console.log(response);
            if (response.output) {
                //this.data = response.data.map((campus) => new CampusDTOV1().deserialize(campus));
                this.data = response.output;
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
                //RESET FILTERS
                this.cc = null;
            }
        });
    }

    onKeyUpFilter(event: KeyboardEvent) {
        const filterValue = (event.target as HTMLInputElement).value.trim();
        if (filterValue.length > 2 || filterValue.length === 0) {
            const character = event.key;
            // Verificar si el carácter es válido (solo teclas de caracteres y modificadores de texto)
            if (
                (character.length == 1 && /^[a-zA-Z0-9]+$/.test(character)) ||
                event.key === 'Backspace' ||
                event.key === 'Delete' ||
                event.key === 'Enter' ||
                event.key === 'Delete'
            ) {
                this.searchSubject.next(filterValue);
            }
        }
    }

    /*applyFilter(filterValue: string) {
        this.filters.pageNumber = 0;
        this.filters.filter = {
            searchTerm: filterValue.trim().toLowerCase(),
        };
        this.getAllCampus(this.filters);
    }*/

    applyFilter(filterValue: any) {    
        if (filterValue.length >= 0 || filterValue.length == 0) {
          this.filters.filter = {
            ...this.filters.filter,
            searchTerm: filterValue.trim().toLowerCase(),
          };
         this.filters.pageNumber = 0;
         this.pageIndex = this.filters.pageNumber;
         this.getAllCampus(this.filters);
         this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    private setPermissions(): void {
        this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,this.router.url );
      
      }
      
      checkPermission(p: string): boolean {
        return this.permissions?.some(r => r.trim() == p.trim())
      }

    toggleRightSidenav() {
        this.sidenavService.toggleSidenav();
    }

    //PARAMETROS
    aplicarParametros(events: any) { //console.log(events);
        let parametros = new ParamsModel();
        /*if (events.NombreCampus) {
          parametros.campusIds = events.NombreCampus;
        }
    
        if (events.NombreArea) {
          parametros.areaResponsableIds = events.NombreArea;
        }*/

        if (events.NombreRegion) {
            parametros.regionesId = events.NombreRegion;
        }

        if (events.NombreInstitucion) {
            parametros.institucionesId = events.NombreInstitucion;
        }
        
        //if (events.Activo) {
            parametros.activo = events.Activo;
        //}

        const Activo = events.Activo; 
        //Agregar Busqueda
        let textoBusqueda = this.dataSource.filter; 
        if (this.inputSearch.nativeElement){
          textoBusqueda = this.inputSearch.nativeElement.value.trim()
        }
    
        //Validacion Etiquetas
        this.inputInstitucion = parametros.institucionesId != undefined;
        this.inputRegion = parametros.regionesId != undefined;
        this.inputEstatus = parametros.activo != undefined;

        console.log(parametros);
        //Parametros & Busqueda
        if (textoBusqueda == null){
            this.filters.filter = parametros;
        }else{
            this.filters.filter = {
                ...parametros,
                "searchTerm": textoBusqueda
            };
        }
        //GRID          
        this.getAllCampus(this.filters);    
    }
    
    btnCleanFilters(c:any){
        this.cc = c; //console.log(this.cc);
    }

}
