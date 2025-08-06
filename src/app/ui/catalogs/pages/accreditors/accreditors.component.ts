import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AccreditorsService } from 'src/app/core/services';
import { Alert, convertByteArrayToBlob, setDataPaginator } from 'src/app/utils/helpers';
import { AcreditadoraDTO, AcreditadoraDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { AccreditorRecordService } from './modals';

@Component({
    selector: 'app-accreditors',
    templateUrl: './accreditors.component.html',
    styleUrls: ['./accreditors.component.scss'],
})
export class AccreditorsComponent implements OnInit {
    @ViewChild('input', { static: true }) inputSearch: ElementRef;
    @ViewChild('paginator', { static: true }) readonly paginator: MatPaginator;

    dataSource: MatTableDataSource<AcreditadoraDTOV1>;
    filters: TablePaginatorSearch;

    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(
        private readonly accreditorRecord: AccreditorRecordService,
        private readonly accreditors: AccreditorsService
    ) {
        this.dataSource = new MatTableDataSource<AcreditadoraDTOV1>([]);
        this.dataSource.filterPredicate = function (data: AcreditadoraDTOV1, filter: string): boolean {
            return data.nombre.toLowerCase().includes(filter.toLowerCase());
        };
        this.filters = new TablePaginatorSearch();
    }

    ngOnInit(): void {
        this.pageSize = 25;
        this.pageIndex = this.filters.pageNumber;
        this.getAllAccreditors(this.filters);
    }

    paginatorChange(event: PageEvent): void {
        this.filters.pageSize = event.pageSize;
        this.filters.pageNumber = event.pageIndex;
        this.getAllAccreditors(this.filters);
    }

    search(term: string): void {
        this.dataSource.filter = term;
        this.filters.pageNumber = 0;
        this.dataSource.paginator = this.paginator;
        // console.log('buscando en la tabla search......');
    }

    openAccreditorRecord(accreditor: AcreditadoraDTOV1): void {
        this.accreditorRecord
            .open({ data: accreditor })
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.getAllAccreditors(this.filters);
                }
            });
    }

    // deleteAccreditor(accreditorId: string): void {
    //     Alert.confirm('Eliminar acreditadora', '¿Deseas eliminar esta acreditadora?').subscribe((result) => {
    //         if (!result || !result.isConfirmed) {
    //             return;
    //         }
    //         this.accreditors.deleteAccreditor(accreditorId).subscribe((response) => {
    //             if (response.exito) {
    //                 Alert.success('', 'Acreditadora eliminada correctamente');
    //                 this.filters.pageNumber = 1;
    //                 this.paginator.firstPage();
    //                 this.getAllAccreditors(this.filters);
    //             }
    //         });
    //     });
    // }

    getAllAccreditorsExcel(): void {
        /* this.accreditors.getAllAccreditorsExcel(this.filters).subscribe((response) => {
          if (response.success) {
            convertByteArrayToBlob(response.data, response.mime, response.name);
          }
        }); */
        const url = this.accreditors.getUrlAllAccreditorsExcel();
        window.open(url, '_blank');
    }

    private getAllAccreditors(filters: TablePaginatorSearch): void {
        this.dataSource.data = [];
        filters.inactives = true;

        this.accreditors.getAllAccreditors(filters).subscribe((response) => {
            if (response.output) {
                const data = response.output.map((accreditor) => new AcreditadoraDTOV1().deserialize(accreditor));
                this.dataSource.data = data;
                this.pageIndex = response.paginacion.pagina;
                this.pageSize = response.paginacion.registros;
                this.length = response.paginacion.count;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.data.forEach((element: any) => {
            for (const key in element) {
                if (!(typeof element[key] === 'boolean') && !Array.isArray(element[key])) {
                    if (!element[key] || element[key] === null || element[key] == undefined) {
                        element[key] = '';
                    }
                }
            }
        });
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
