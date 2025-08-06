import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RolesService, UsersService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { FormControl } from '@angular/forms';

import { saveAs } from 'file-saver';

import {
    TablePaginatorSearch,
    Vista,

    CatalogoRolesDTO
    
} from 'src/app/utils/models';

import { RolRecordService } from './modals/rol-record/rol-record.service';

import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
}) export class RolesComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    data: CatalogoRolesDTO[];
    dataSource: MatTableDataSource<CatalogoRolesDTO>;
    selection: SelectionModel<CatalogoRolesDTO>;

    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permission: boolean;
    permissions: string[];

    searchControl = new FormControl();

    constructor(
        private router: Router,
        private readonly rolRecord: RolRecordService,
        private readonly roles: RolesService,
        private basicNotification: BasicNotification,
        private users: UsersService,
        private access : Vista,
    ){
        this.data = [];
        this.dataSource = new MatTableDataSource<CatalogoRolesDTO>([]);
        // this.dataSource.filterPredicate = function (record: CatalogoRolesDTO, filter: string): boolean {
        //     return (
        //         record.nombre.toLowerCase().includes(filter.toLowerCase()) 
        //     );
        // };
        this.selection = new SelectionModel<CatalogoRolesDTO>(true);
        this.filters = new TablePaginatorSearch();
    }

    ngOnInit(): void{
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllRoles(this.filters);
        
        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });
    }

    search(term: string): void {
        //this.dataSource.filter = term;
        this.filters.pageNumber = 0;
        //this.dataSource.paginator = this.paginator;
    }
    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllRoles(this.filters);
    }


    private getAllRoles(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        // filters.filter = {};
        this.roles.getAllRoles(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((rol) => new CatalogoRolesDTO().deserialize(rol));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }


    openRolRecord(){
        this.rolRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllRoles(this.filters));
    }

    editRol(rol: CatalogoRolesDTO){
        var rolComplete =new CatalogoRolesDTO();
        this.roles.getCatalogoRolById(rol.id).subscribe((response) => {
          if (response.output) {
            var dataList = response.output.map((res) => new CatalogoRolesDTO().deserialize(res));
            rolComplete = dataList[0];
            this.rolRecord
            .open({ data: rolComplete, modoLectura: false })
            .afterClosed()
            .subscribe(() => this.getAllRoles(this.filters));
          }
        });


        
    }
    verRol(rol: CatalogoRolesDTO){
        var rolComplete =new CatalogoRolesDTO();
        this.roles.getCatalogoRolById(rol.id).subscribe((response) => {
          if (response.output) {
            var dataList = response.output.map((res) => new CatalogoRolesDTO().deserialize(res));
            rolComplete = dataList[0];
            this.rolRecord
            .open({ data: rolComplete, modoLectura: true })
            .afterClosed()
            .subscribe(() => this.getAllRoles(this.filters));
          }
        });

    }

    getAllRolesExcel(){
        this.roles.getAllRolesExcel(this.filters).subscribe((response) => saveAs(response, 'Roles.xlsx'));
    }


    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     if (filterValue.length > 2 || filterValue.length == 0) {
    //         this.filters.filter = {
    //             nombre: filterValue.trim().toLowerCase(),
    //         };
    //         this.filters.pageNumber = 0;
    //         this.pageIndex = this.filters.pageNumber;
    //         this.getAllRoles(this.filters);
    //         // this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }

    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.filters.pageNumber = 0;
            this.pageIndex = this.filters.pageNumber;
            this.getAllRoles(this.filters);
            // this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    public disableRol(rol: CatalogoRolesDTO): void {
        const msg = `Rol ${rol.activo ? 'inactivado' : 'activado'} correctamente`;
        this.roles.disableRol(rol.id, !rol.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif('success', msg);
                this.paginator.firstPage();
                this.getAllRoles(this.filters);
            } else {
                this.basicNotification.notif('error', `No se puede ${!rol.activo ? 'inactivar' : 'activar'} el Usuario`);
                
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