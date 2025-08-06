import { Component, Inject, OnInit, Input } from '@angular/core';
import { DetailsIndicatorDTOV1, DetailsIndicatorNormativaDTOV1, NormativaDTOV1, TablePaginatorSearch } from 'src/app/utils/models';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsIndicatorsService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailsIndicatorAllNormativeDTOV1 } from 'src/app/utils/models/detailsAllNormative.dto';
import { Alert, Auth } from 'src/app/utils/helpers';
import { IndicadorNormativa } from 'src/app/utils/models/indicador-normativa';
import { stringify } from 'querystring';
import { Normativa } from 'src/app/utils/interfaces/normativa';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';

@Component({
  selector: 'app-normative-record',
  templateUrl: './normative-record.component.html',
  styleUrls: ['./normative-record.component.scss']
})
export class NormativeRecordComponent implements OnInit {
  [x: string]: any;
  normativeRecordForm: FormGroup;
  dataSource: MatTableDataSource<DetailsIndicatorDTOV1>;
  data: any[]; // todas las normativas
  normativasExistentes: any[];

  claveStorage: any[];
  indicadorStorage: any[];
  descripcionIndicadorStorage: any[];
  componenteStorage: any[];
  elementoEvaluacionStorage: any[];
  areaCentralStorage: any[];
  subAreaCentralStorage: any[];
  activoStorage: boolean;
  estatusStorage: string;
  idStorage: any;
  dataSourceAll: MatTableDataSource<any>;
  estatusRecord: boolean;
  isChecked: any;
  elementoEvaluacionIdStorage: any;
  usuarioCreacionStorage: any;
  usuarioModificacionStorage: any;
  componenteIDStorage: any;
  areaCentralIDStorage: number;
  subAreaCentralIDStorage: any;
  indicadorIDStorage: any;
  del: any[] = [];
  normativas: any[] = [];
  resultadoGeneralNormativa: any;
  @Input() indLeer: boolean;
  private searchsub$ = new Subject<string>();

  filters: TablePaginatorSearch;
  cicloEvaluacionId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataSourceNormativa: any,
    private detailsIndicator: DetailsIndicatorsService,
    formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private basicNotification : BasicNotification,
    private users: UsersService,
  ) {
    this.normativasExistentes = dataSourceNormativa // asignacion de normativas previamente configuradas
    this.normativeRecordForm = formBuilder.group({
      activo: ['']
    });
    this.filters = new TablePaginatorSearch();
  }

  ngOnInit(): void {
    this.getResume();
    this.filters.filter = {
      activo: true,
    };
    this.filters.pageSize = 0;
    this.filters.pageNumber = 0;
    this.getNormatives(this.filters);
    this.searchsub$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filtervalue: string) => {
      this.filters.filter = {
        Clave: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
        Nombre: filtervalue.trim().toLowerCase() != '' ? filtervalue.trim().toLowerCase() : null,
        activo: true
      };
      this.filters.pageNumber = 0;
      this.filters.pageSize = 0;
      this.getNormatives(this.filters);
    });
  }




  public getResume(): void {
    let indicadorInfo = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    this.indicadorIDStorage = indicadorInfo.indicadorId;
    this.usuarioCreacionStorage = indicadorInfo.usuarioCreacion;
    this.usuarioModificacionStorage = indicadorInfo.usuarioModificacion;
    this.cicloEvaluacionId = indicadorInfo.cicloEvaluacionId;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchsub$.next(filterValue);
  }

  public getNormatives(filters: TablePaginatorSearch): void {
    this.detailsIndicator.getAllNormatives(filters).subscribe((response) => {
      let dataTodasLasNormativas = response.output.map((detailsIndicator) => new DetailsIndicatorAllNormativeDTOV1().deserialize(detailsIndicator));
      if (this.normativasExistentes && this.normativasExistentes.length > 0) {
        let ids = this.normativasExistentes.map(x => x.normativaId);
        let normativasFiltradas = dataTodasLasNormativas.filter(normativa => !ids.some(id => id === normativa.id))
        this.dataSourceAll = new MatTableDataSource(normativasFiltradas);
      }
      else {
        this.dataSourceAll = new MatTableDataSource(dataTodasLasNormativas);
      }
    });
  }

  submit(): void {
    alert("submir");
  }

  public guardar(): void {
    this.normativas.forEach(element => {
      element.usuarioCreacion = this.users.userSession.id;
      element.cicloEvaluacionId = this.cicloEvaluacionId;
    });
    this.detailsIndicator.getAddCeNormatives(this.normativas).subscribe((response) => {
      this.basicNotification.notif("success",'Normativa agregada correctamente', 5000);
      this.ref.close(true);
    });
  }

  onChange($event: any, indica: DetailsIndicatorAllNormativeDTOV1) {
    const newIndicador: DetailsIndicatorNormativaDTOV1 = new DetailsIndicatorNormativaDTOV1();

    this.isChecked = $event.checked;
    
    newIndicador.indicadorId = this.indicadorIDStorage;
    newIndicador.normativaId = indica.id;
    newIndicador.claveNormativa = indica.clave;
    newIndicador.normativa = indica.nombre;
    newIndicador.activo = true;
    newIndicador.usuarioCreacion = this.usuarioCreacionStorage;
    newIndicador.usuarioModificacion = this.usuarioCreacionStorage;

    if (this.isChecked == true) {
      this.normativas.push(newIndicador);
    }
    if(this.isChecked == false){
      this.del.push(newIndicador.normativaId);
    }
    const res = this.normativas.filter(x => !this.del.includes(x.normativaId));
    this.normativas = res;
  }

  cerrar() {
    this.ref.close(false);
  }
}
