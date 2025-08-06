import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NormativeService, UsersService } from 'src/app/core/services';
import { EvaluationElementCatalogService } from 'src/app/core/services/api/evaluation-element-catalog/evaluation-element-catalog.service';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { CatalogoElementoEvaluacionDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvaluationElementRecordService } from './modals/evaluation-element-record/evaluation-element-record.service';
import { ModulesCatalogDTO } from 'src/app/utils/models/modules-catalog.dto';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-evaluation-element',
    templateUrl: './evaluation-element.component.html',
    styleUrls: ['./evaluation-element.component.scss'],
})
export class EvaluationElementComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;
    data: CatalogoElementoEvaluacionDTOV1[];
    dataSource: MatTableDataSource<CatalogoElementoEvaluacionDTOV1>;
    selection: SelectionModel<CatalogoElementoEvaluacionDTOV1>;
    disabled: boolean;
    permission: boolean;
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    length: number;
    thisAccess: Vista;
    thisModule: ModulesCatalogDTO;
    permissions: string[];

    searchControl = new FormControl();

    evaluationElementRecordForm: FormGroup;
    constructor(
        private router: Router,
        private readonly evaluationElementeRecord: EvaluationElementRecordService,
        private readonly evaluationElementCatalogService: EvaluationElementCatalogService,
        private readonly normative: NormativeService,
        private users: UsersService,
        private readonly formBuilder: FormBuilder,
        private basicNotification : BasicNotification,
        private access : Vista,
    ) {
        this.data = [];
        this.dataSource = new MatTableDataSource<CatalogoElementoEvaluacionDTOV1>([]);
        this.dataSource.filterPredicate = function (record: CatalogoElementoEvaluacionDTOV1, filter: string): boolean {
            return (
                record.clave.toLowerCase().includes(filter.toLowerCase()) ||
                record.nombre.toLowerCase().includes(filter.toLowerCase())
            );
        };
        this.selection = new SelectionModel<CatalogoElementoEvaluacionDTOV1>(true);
        this.disabled = null;
        this.permission = null;
        this.thisAccess = new Vista();
        this.permissions = [];
        this.filters = new TablePaginatorSearch();
        this.evaluationElementRecordForm = this.formBuilder.group({
            busqueda: [null],
            
      
          }); 
    }

    ngOnInit(): void {
        this.setPermissions();
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.filters.pageSize = 25;
        this.filters.filter = {};
        this.getAllEvaluationElementsCatalogs(this.filters);

        this.searchControl.valueChanges.pipe(
            debounceTime(700), // Espera 700ms después de que el usuario deja de escribir
            distinctUntilChanged() // Emitir solo si el valor es diferente del último emitido
          ).subscribe(value => {
            this.applyFilter(value);
          });
    }

    editElementEvaluationCatalog(elementoEvaluacion: CatalogoElementoEvaluacionDTOV1): void {
        this.evaluationElementeRecord
            .open({ data: elementoEvaluacion })
            .afterClosed()
            .subscribe(() => this.getAllEvaluationElementsCatalogs(this.filters));
    }

    deleteElementEvaluationCatalogByConfimation(elementoEvaluacion: CatalogoElementoEvaluacionDTOV1): void {
        Alert.confirm('Eliminar Elemento de evaluación', `¿Deseas eliminar el elemento de evaluación?`).subscribe(
            (result) => {
                if (!result || !result.isConfirmed) {
                    return;
                }
                // console.log(elementoEvaluacion);
                this.deleteEvaluationElementCatalog(elementoEvaluacion);
            }
        );
    }

    disableElementEvaluationCatalog(data: CatalogoElementoEvaluacionDTOV1): void {
        const msg = `Elemento de Evaluación ${data.activo ? 'inactivado' : 'activado'} correctamente`;
        this.evaluationElementCatalogService
            .disableEvaluationElementCatalog(data.id, !data.activo)
            .subscribe((response) => {
                if (response.exito) {
                    this.basicNotification.notif("success",msg);
                    this.getAllEvaluationElementsCatalogs(this.filters);
                } else {
                    console.error(response.mensaje);
                    this.basicNotification.notif("error",`No se puede ${!data.activo ? 'inactivar' : 'activar'} el Elemento de Evaluación`);

                }
            });
    }

    openElementEvaluationCatalogRecord(): void {
        this.evaluationElementeRecord
            .open()
            .afterClosed()
            .subscribe(() => this.getAllEvaluationElementsCatalogs(this.filters));
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllEvaluationElementsCatalogs(this.filters);
    }

    getAllEvaluationElementsCatalogsExcel(): void {
        this.evaluationElementCatalogService
            .getAllEvaluationElementsCatalogsExcel(this.filters)
            .subscribe((response) => saveAs(response, 'ElementosEvaluacion.xlsx'));
    }

    private deleteEvaluationElementCatalog(elementoEvaluacion: CatalogoElementoEvaluacionDTOV1): void {
        this.evaluationElementCatalogService
            .deleteEvaluationElementCatalog(elementoEvaluacion.id)
            .subscribe((response) => {
                if (response.exito) {
                    this.basicNotification.notif("success",'Elemento de evaluación eliminado correctamente');
                    this.paginator.firstPage();
                    this.getAllEvaluationElementsCatalogs(this.filters);
                } else {
                    console.error(response.mensaje);
                    this.basicNotification.notif("error",'No se puede eliminar el Elemento de evaluación');
                }
            });
    }

    private getAllEvaluationElementsCatalogs(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        this.data = [];
        // filters.filter = {};
        this.evaluationElementCatalogService.getAllEvaluationElementsCatalogs(filters).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((campus) => new CatalogoElementoEvaluacionDTOV1().deserialize(campus));
                this.dataSource.data = this.data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
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
    //         this.getAllEvaluationElementsCatalogs(this.filters);
    //         this.dataSource.filter = filterValue.trim().toLowerCase();
    //     }
    // }
    applyFilter(filterValue: any) {        
        if (filterValue.length > 2 || filterValue.length == 0) {
            this.filters.filter = {
                nombre: filterValue.trim().toLowerCase(),
            };
            this.paginator.firstPage();
            this.getAllEvaluationElementsCatalogs(this.filters);
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
