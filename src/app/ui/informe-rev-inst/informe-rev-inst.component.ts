import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services';
import { Alert, setDataPaginator } from 'src/app/utils/helpers';
import { InformeRevInstService } from 'src/app/core/services/api/informe-rev-inst/informe-rev-inst.service'
import { Router } from '@angular/router';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { InformeRevInstDTO } from 'src/app/utils/models/informe-rev-inst.dto';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { CicloV2DTO } from 'src/app/utils/models/ciclo.v2.dto';
import { MatSelectChange } from '@angular/material/select';

import {
    TablePaginatorSearch,
    Vista,    
} from 'src/app/utils/models';
import { InformeRisRecordService } from './modals';

@Component({
    selector: 'app-informe-rev-inst',
    templateUrl: './informe-rev-inst.component.html',
    styleUrls: ['./informe-rev-inst.component.scss'],
    providers: [DatePipe]
})

export class InformeRevInstComponent implements OnInit {
    @ViewChild('drawer') drawer: MatDrawer | undefined;
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    data: InformeRevInstDTO[];
    dataSource: MatTableDataSource<InformeRevInstDTO>;
    selection: SelectionModel<InformeRevInstDTO>;

    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permission: boolean;
    permissions: string[];
    //informeRecordForm: FormGroup;
    ciclosList: CicloV2DTO[] = [];

    searchControl = new FormControl();
    
    //Filtro
    FilterForm: FormGroup;
    fecIni: any;
    fecFin: any;
    ciclo: any;
    activo: any;
    buscar: any;
    limitDate = new Date();


    constructor(
        private router: Router,
        private readonly informeRecord: InformeRisRecordService,
        private readonly formBuilder: FormBuilder,
        private basicNotification: BasicNotification,
        private users: UsersService,
        private access : Vista,
        private readonly informes: InformeRevInstService,
        private readonly informeService: InformeRevInstService,
        private datePipe: DatePipe
    ){
        this.data = [];
        this.dataSource = new MatTableDataSource<InformeRevInstDTO>([]);
        this.selection = new SelectionModel<InformeRevInstDTO>(true);
        this.filters = new TablePaginatorSearch();

        // this.informeRecordForm= this.formBuilder.group({
        //     busqueda: [null]
        //   }); 

        this.FilterForm = this.formBuilder.group({
            fechaInicio: [null, []],
            fechaFin: [null, []],
            ciclo: [null, []],
            activo: [null, []],
            busqueda: [null]
        });

        this.getAllCiclos();
    }

    ngOnInit(): void{
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllInformes(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });

    }

    getAllCiclos():void{
        const filters = new TablePaginatorSearch();
        filters.pageSize = 999999;
        filters.filter = {activo: true}
        this.informeService.getAllCiclos(filters).subscribe((response) => {
            if (response.exito) {
                this.ciclosList = response.output.map((ciclo) => new CicloV2DTO().deserialize(ciclo));                 
            }
        });
    }

    search(term: string): void {
        this.filters.pageNumber = 0;
    }
    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllInformes(this.filters);
    }

    getAllInformes(filters: TablePaginatorSearch): void{
        this.dataSource.data = [];
        this.data = [];
        this.informes.getAllInformes(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((informe) => new InformeRevInstDTO().deserialize(informe));
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
      
    checkPermission(p: string): boolean { //return true;
        return this.permissions?.some(r => r.trim() == p.trim())
    }

    obtenerFechaFormateada(fecha: string): string {
        return this.datePipe.transform(fecha, 'MMMM dd, yyyy') || '';
      }


    openInformeRecord(): void {
        this.informeRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllInformes(this.filters));
    }

    getAllInformesExcel(): void{
        this.informes.getAllInformesExcel(this.filters).subscribe((response) => saveAs(response, 'InformesDeRevisionInstitucional.xlsx'));
    }

    applyFilter(filterValue: any) {        
        this.FilterForm.controls.busqueda.patchValue(filterValue);
        this.aplicarFiltro();
    }

    editInforme(informe: InformeRevInstDTO): void { 
         this.informeRecord
             .open(informe)
             .afterClosed()
             .subscribe((result) => {
                 this.getAllInformes(this.filters);
             });
    }

    deleteInformeByConfimation(informe: InformeRevInstDTO): void {
        Alert.confirm('Eliminar el informe', `¿Deseas eliminar el informe?`).subscribe((result) => {
            if (!result || !result.isConfirmed) {
                return;
            }
            this.deleteInforme(informe);
        });
    }

    private deleteInforme(informe: InformeRevInstDTO): void { 
        this.informes.deleteInforme(informe.id).subscribe((result) => { console.log("borrado", result);
            this.basicNotification.notif("success",'Informe eliminado correctamente');
            this.paginator.firstPage();
            this.getAllInformes(this.filters);
        });
    }

    setStatusInforme(data: InformeRevInstDTO): void {
        const msg = `Informe ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.informes.satusInforme(data.id, !data.activo).subscribe((response) => {
            if (response.exito) {
                this.basicNotification.notif("success",msg);
                this.getAllInformes(this.filters);
            } else {
                console.error(response.mensaje);
                this.basicNotification.notif("error",`No se puede ${!data.activo ? 'activar' : 'desactivar'} la Informe`);
            }
        });
    }


    

    viewFile(file:any){
        this.informes.GetAzureFile(file.archivoAzureId).subscribe((res:any) => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
            PDF_link.download = file.nombreFormato;
            PDF_link.click();
        });
    }

    DownloadFile(file:any){
        var fileExt = file.nombreArchivo.split('.');
        if (fileExt.length > 1){
            this.informes.GetAzureFile(file.archivoAzureId).subscribe((res:any) => {
                saveAs(res, file.nombreArchivo);
            });
        }
    }

    canViewFile(file:any) : boolean{
        if(file.nombreArchivo){
            if (file.nombreArchivo.toLowerCase().includes('.pdf')){
                return true;      
            }
        }
        return false
    }
    canDownloadFile(file:any) : boolean{
        if(file.nombreArchivo){
            var fileExt = file.nombreArchivo.split('.');
            if (fileExt.length < 2) 
            {
                return false;
            }
            if (!file.nombreArchivo.toLowerCase().includes('.pdf')){
                return true;      
            }
        }

        return false;
    }

    btnCleanFilters(c: any) {
        if (c == 'all') {
          this.FilterForm.get('fechaInicio').setValue(null);
          this.FilterForm.get('fechaFin').setValue(null);
          this.FilterForm.get('ciclo').setValue(null);
          this.FilterForm.get('activo').setValue(null);
          this.FilterForm.get('busqueda').setValue(null);
        } else if (c == 'fechas') {
          this.FilterForm.get('fechaInicio').setValue(null);
          this.FilterForm.get('fechaFin').setValue(null);
          this.aplicarFiltro();
          if (this.drawer.opened) {
            this.drawer.toggle();
          }
        } else {
          this.FilterForm.get(c).setValue(null);
          this.aplicarFiltro();
          if (this.drawer.opened) {
            this.drawer.toggle();
          }
        }
      }

      onSelectionChange(event: MatSelectChange, campo: any) {
        let val = event.value;//console.log('Event.value',val);
        if (campo === 'ciclo') {
          if (val.length <= this.ciclosList.length) {
            if (val[0] === 0) {
              val.splice(0, 1);
              this.FilterForm.controls.ciclo.patchValue(val);
            }
          }
        }
        else if(campo === 'activo')
        {
            this.FilterForm.controls.activo.patchValue(val);
        }
        //console.log(val);
      }

      toggleAllSelection(campo: any) {
        if (campo === 'ciclo') {
          const allSelected = this.FilterForm.controls.ciclo.value.length === this.ciclosList.length; 
          //console.log(this.FilterForm.controls.ciclo.value.length,this.ciclosList.length,allSelected);
          this.FilterForm.controls.ciclo.patchValue(allSelected ? [] : [0, ...this.ciclosList.map((item: { id: any; }) => item.id)]); 
          //console.log([0,...this.ciclosList.map((item: { id: any; }) => item.id)]);
        }
        
      }

      aplicarFiltro(){
        this.fecIni = this.FilterForm.get('fechaInicio').value;
        this.fecFin = this.FilterForm.get('fechaFin').value;
        this.ciclo = this.paramsAll(this.FilterForm.get('ciclo').value);//console.log('ciclo:',this.ciclo);
        this.activo = this.FilterForm.get('activo').value; //console.log("Activo form", this.activo);
        this.buscar = this.FilterForm.get('busqueda').value;

        const fechaInicio = (this.fecIni) ? this.fecIni : null;
        const fechaFin = (this.fecFin) ? this.fecFin : null;
        const ciclosId = (this.ciclo) ? (this.ciclo.length >= 1 && this.ciclo.length <= this.ciclosList.length) ? this.ciclo : null : null;
        const activo = this.activo;
        const busqueda = this.buscar;
        const params = {
        fechaInicio,
        fechaFin,
        ciclosId,
        activo,
        busqueda
        }
        //console.log(params);
        this.applyFilterParams(params);
      }

      paramsAll(data: any) {
        const val = data;
        if (val && val[0] === 0) { val.splice(0, 1) }//console.log(val);
        return val;
      }

      applyFilterParams(params: any): void {
        this.filters.filter = params;
        this.filters.pageNumber = 0;
        this.pageIndex = this.filters.pageNumber;
        this.getAllInformes(this.filters);
        if (this.drawer.opened) {
          this.drawer.toggle();
        }
      }


}

