import { Component, Inject, OnInit } from '@angular/core';
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
  //ref: any;
  //normativas: any;
  del: any[] = [];
  normativas: any[] = [];
  resultadoGeneralNormativa: any;
  private searchsub$ = new Subject<string>();

  ////  normativas: Arrayany[];
  //normativas: Array<DetailsIndicatorNormativaDTOV1>;
  //resultado: DetailsIndicatorNormativaDTOV1;

  //resultado: Array<Normativa>;

  //  normativas: any[] = [];

  filters: TablePaginatorSearch;
  //normativa: any;
  //indicadores: DetailsIndicatorNormativaDTOV1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataSourceNormativa: any,
    private detailsIndicator: DetailsIndicatorsService,
    formBuilder: FormBuilder,
    //private readonly indicadores: DetailsIndicatorNormativaDTOV1,
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
    //this.getNormativesPrincipal();
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
        // UserId: Auth.getSession().id,
      };
      this.filters.pageNumber = 0;
      this.filters.pageSize = 0;
      this.getNormatives(this.filters);
    });
  }




  public getResume(): void {
    //    console.log(JSON.parse(localStorage.getItem('idIndicadorSiac')));
    this.indicadorIDStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorId;
    this.usuarioCreacionStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).usuarioCreacion;
    this.usuarioModificacionStorage = JSON.parse(localStorage.getItem('idIndicadorSiac')).usuarioModificacion;
    /*this.idStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).procesoEvaluacionId;
    this.claveStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).claveComponente;
    this.indicadorStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).indicador;
    this.descripcionIndicadorStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).descripcionIndicador;
    this.componenteStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).componente;
    this.componenteIDStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).componenteId;
    this.elementoEvaluacionStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).elementoEvaluacion;
    this.elementoEvaluacionIdStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).elementoEvaluacionId;
    this.areaCentralStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).areaCentral;
    this.areaCentralIDStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).areaCentralId;
    this.subAreaCentralStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).subAreaCentral;
    this.subAreaCentralIDStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).subAreaCentralId;
    this.activoStorage =JSON.parse(localStorage.getItem('idIndicadorSiac')).activo;
    this.estatusStorage = this.activoStorage? "Activo":"Inactivo"*/
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
      // this.data = response.output.map((detailsIndicator) => new DetailsIndicatorAllNormativeDTOV1().deserialize(detailsIndicator));
      // this.resultadoGeneralNormativa = this.data;
      // let idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac')).indicadorSiacid;
      // let procesoEvaluacionId = JSON.parse(localStorage.getItem('idIndicadorSiac')).procesoEvaluacionId;
      // let filtro = {"procesoEvaluacionId": procesoEvaluacionId,"indicadorSiacid": idIndicadorSiac};

      // this.detailsIndicator.getNormatives(filtro).subscribe((response) => {
      //   this.resultadoNormativa = response.output;
      //   //console.log(this.resultadoNormativa);

      //   for(var i in this.resultadoNormativa)
      //   { 
      //     for(var j in this.resultadoGeneralNormativa)
      //     { 
      //       if (this.resultadoNormativa[i].normativaId == this.resultadoGeneralNormativa[j].id){
      //         this.resultadoGeneralNormativa.splice(j, 1); 
      //     }
      //     }
      //   }
      //   this.data = this.resultadoGeneralNormativa;
      //   this.dataSourceAll = new MatTableDataSource(this.data);  
      //  });      
    });
  }

  submit(): void {
    alert("submir");
  }

  public guardar(): void {
    //console.log("normativas "+this.normativas);
    this.normativas.forEach(element => {
      element.usuarioCreacion = this.users.userSession.id;
    });
    this.detailsIndicator.getAddNormatives(this.normativas).subscribe((response) => {
      //console.log("normativas "+response.output);
      // Alert.success('', 'Normativa agregada correctamente');
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
    }//console.log(this.evidencias,this.del);
    const res = this.normativas.filter(x => !this.del.includes(x.normativaId));
    this.normativas = res; console.log(this.normativas);
    
    /*else {
      //alert("se SACA del array");
    }*/
    //this.isChecked = false ;
    //alert(this.isChecked);
    //console.log(newIndicador);
    /*{
      "procesoEvaluacionId": this.idStorage,
      "indicadorSiacid": this.indicadorStorage,
      "componenteId": this.componenteStorage,
      "elementoEvaluacionId": 0,
      "areaCentralId": this.areaCentralStorage,
      "subAreaCentralId": this.subAreaCentralStorage,
      "normativaId": 0,
      "claveNormativa": indica.clave,
      "normativa": indica.nombre,
      "activo": true,
      "usuarioCreacion": 0,
      "usuarioModificacion": 0
    }*/


    /* {
       "id": 1,
       "clave": "RI-1",
       "nombre": "Lineamientos del comite de ingreso y permanencia estudiantil CIPE de la Universidad del Valle de Mexico",
       "activo": false,
       "fechaCreacion": "2024-03-02T23:44:49.963",
       "usuarioCreacion": 22,
       "fechaModificacion": "2024-03-02T23:44:49.963",
       "usuarioModificacion": 22,
       "tblIndicadoresNormativa": []
     }*/



    /*  this.indicadores.updateIndicador(
        indica
          ).subscribe((response) => {
            console.log(response.output);
          if (response.exito) {
            const msg = `indicador ${ this.isChecked? 'activado' : 'inactivado'} correctamente`;
            Alert.success('', msg);
              this.getAllIndicadores(this.filters);
  
          } else {
              Alert.error('', `No se puede ${!this.isChecked ? 'deshabilitar' : 'habilitar'} el indicador`);
          }
      });*/
  }

  /*
  this.indicadores.updateIndicador(newIndicador).subscribe(() => {
  Alert.success('', 'Normativa agregada correctamente');
  this.ref.close(true);
});


  */

  cerrar() {
    this.ref.close(false);
  }
}
