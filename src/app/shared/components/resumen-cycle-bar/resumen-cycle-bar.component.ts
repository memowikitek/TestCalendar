import { Component,OnInit,Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { CicloEvaDTOV1, CycleEvaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { CycleEvaluationRecordService } from 'src/app/ui/evaluation-cycle/modals/cycle-record/cycle-record.service';

@Component({
  selector: 'app-resumen-cycle-bar',
  templateUrl: './resumen-cycle-bar.component.html',
  styleUrls: ['./resumen-cycle-bar.component.scss'],
  providers: [DatePipe] // Agregar DatePipe como provider
})
export class ResumenCycleBarComponent implements OnInit {
  @Input() arrList: any;
  @Input() totalIndicadores: any;
  @Input() bol: boolean;
  @Input() urlRedirect : string;
  @Input() mostrarEditar: boolean;
  pageIndex: number;
  pageSize: number;
  filters: TablePaginatorSearch;
  dataSource: MatTableDataSource<CicloEvaDTOV1>;
  data: CicloEvaDTOV1[];
  @Input() title : string;

  constructor(
    private datePipe: DatePipe, 
    private readonly EvaCS: EvaluationCycleService,
    private readonly CycleEvaRecordS: CycleEvaluationRecordService
  ) { 
    this.dataSource = new MatTableDataSource<CicloEvaDTOV1>([]);
    this.filters = new TablePaginatorSearch();
  }

  ngOnInit(): void {
    //console.log(this.arrList);
    //this.pageSize = 25;
    //this.pageIndex = this.filters.pageNumber;
    this.filters.pageSize = 25;
    this.filters.filter = {};
    //this.getAllCycleEva(this.filters);
  }
  
  redirectEdit(url: any): void {
    window.location.assign(url);
  }

  private getAllCycleEva(filters: TablePaginatorSearch): void {
    this.dataSource.data = [];
    this.data = [];
    this.EvaCS.getAllEvaluacionCycle(filters).subscribe((response) => {
      //if (response.output) {
        this.data = response.output.map((eva) => new CicloEvaDTOV1().deserialize(eva));
        //console.log('ListaData:', this.data);
        this.dataSource.data = this.data;
        //this.pageIndex = response.paginacion.pagina;
        //this.pageSize = response.paginacion.registros;
        //this.length = response.paginacion.count;  
      //}
    });
  }

  editRecords(EvaCS: CicloEvaDTOV1): void {
    this.CycleEvaRecordS
      .open({ data: EvaCS })
      .afterClosed()
      .subscribe(() => this.getAllCycleEva(this.filters));
  }

  obtenerFechaFormateada(fecha: string): string {
    return this.datePipe.transform(fecha, 'MMMM dd, yyyy') || '';
  }
}
