import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {  DetailsIndicatorDTOV1, DetailsIndicatorNormativaDTOV1, IndicadoresDTOV1, TablePaginatorSearch, ListaArchivosModuloBienvenida, NormativaDTOV1, Vista } from 'src/app/utils/models';
import { IndicadorData, IndicatorsRecordService } from '../indicators/modals/indicators-record/indicators-record.service';
import { IndicatorsService, UsersService } from 'src/app/core/services';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';
import { FormGroup } from '@angular/forms';
import { DetailsCeIndicatorLectura } from 'src/app/utils/models/detalles-ce-indicador-lectura.dto';
import { IndicatorsCeRecordService } from './modals/indicators-record/indicators-record.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberSymbol } from '@angular/common';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-indicator',
  templateUrl: './details-indicator.component.html',
  styleUrls: ['./details-indicator.component.scss']
})
export class DetailsIndicatorComponent implements OnInit {
  [x: string]: any;
  dataSource: MatTableDataSource<DetailsIndicatorDTOV1>;
  dataSourceAR: MatTableDataSource<DetailsIndicatorDTOV1>;
  dataSourceRubricas: MatTableDataSource<RubricasDTOV1>;
  dataSourceIndicador: MatTableDataSource<IndicadoresDTOV1>;
  data: any[];
  filters: TablePaginatorSearch;
  indicadorCeRecordForm: FormGroup;
  cicloEvaluacionId: Number;
  dataI: IndicadoresDTOV1;
  detailsForm: FormGroup;
  formBuilder: any;
  datos: RubricasDTOV1[];
  claveStorage: any [];
  indicadorStorage: any [];
  descripcionIndicadorStorage: any [];
  componenteStorage: any ;
  elementoEvaluacionStorage: any ;
  areaCentralStorage: any [];
  subAreaCentralStorage: any [];
  activoStorage: any [];
  estatusStorage: string;
  idStorage: any;
  normativas : any[] = [];
  ids: number;
  idIndicadorSiac: any;
  IndicadorSiac: any;
  tipoResultado = 'Nivel/Modalidad';
  indLeer: boolean | false;
  lecturaIndicador: DetailsCeIndicatorLectura;
  urlRetorno: string;
  permission: boolean;
  permissions: string[];
  
  constructor(
    private readonly indicadoresRecord: IndicatorsRecordService,    
    private readonly indicadoresCeRecord: IndicatorsCeRecordService,
    private detailsIndicator: IndicatorsService,
    private router: Router,
    private access : Vista,
    private users: UsersService,
  ){
    this.lecturaIndicador = new DetailsCeIndicatorLectura();    
    this.detailsIndicator.currentReadState.subscribe((valor: boolean) => {
      this.indLeer = valor;
    });
   } 

  isDisabled = false;
  ngOnInit(): void {
    
    this.isDisabled = true;
    this.idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    this.IndicadorSiac = this.idIndicadorSiac;
    this.getLecturaIndicador();
    this.getResume();
    this.setPermissions();
  }
  
  getLecturaIndicador() {
    const idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac'));
    this.lecturaIndicador.deserialize(idIndicadorSiac);
  }

  public getResume(): void {
    const { etapaId, indLeer, cicloEvaluacionId, indicadorId, nombreCampus, claveInstitucion, nivelModalidad, nombreArea, nombreElementoEvaluacion, procesoEvaluacionId, claveIndicador, nombreIndicador, descripcionIndicador, nombreComponente, activo } = this.idIndicadorSiac;
    this.getCeIndicatorDetails(indicadorId, cicloEvaluacionId);
    this.cicloEvaluacionId = cicloEvaluacionId;
    this.etapaId = etapaId;
    this.idStorage = procesoEvaluacionId;
    this.idIndicadorStorage = '';
    if (this.etapaId > 0){
      this.urlRetorno = '/indicator-goals-capture/detailindicator';
      const { areaResponsable, campus, nivelModalidad, claveInstitucion, procesoEvaluacion, obligadoLeerIndicador } = this.idIndicadorSiac;
      this.indLeer = true;
      this.campusStorage = campus;
      this.nivelStorage = nivelModalidad;
      this.institucionStorage = claveInstitucion;
      this.areaResponsableStorage = areaResponsable;
      this.idStorage = procesoEvaluacion;
    }else {
      this.indLeer = false;
      this.urlRetorno = '/evaluation-generation';
      this.campusStorage = nombreCampus;
      this.nivelStorage = nivelModalidad;
      this.institucionStorage = claveInstitucion;
      this.areaResponsableStorage = nombreArea;
      this.claveStorage = claveIndicador;
      this.indicadorStorage = nombreIndicador;
      this.descripcionIndicadorStorage = descripcionIndicador;
      this.componenteStorage = this.idIndicadorSiac.claveComponente +' - ' + nombreComponente;
      this.elementoEvaluacionStorage = this.idIndicadorSiac.claveElementoEvaluacion +' - ' + nombreElementoEvaluacion;
    }

    if (this.idIndicadorSiac.tipoResultado == 2)
    {
      this.tipoResultado = 'Común'
    }
    this.estatusStorage = activo? "Activo":"Inactivo"
  }
  public getCeIndicatorDetails(indicadorId: any, cicloEvaluacionId: any): void {
    this.detailsIndicator.getCeIndicadorInfo(indicadorId, cicloEvaluacionId).subscribe((response: any) => {
      interface SubAreaCentral {
        nombre: string;
        areaCentral: string;
      }
  
      const subAreaCentralList: SubAreaCentral[] = response.output.subAreaCentrales;
      const {activo} = response.output;
      const {
        claveElementoEvaluacion,
        claveComponente,
        elementoEvaluacion,
        claveIndicador,
        nombre,
        descripcionIndicador,
        componente,
      } = response.output;
  
      this.idIndicadorSiac.claveElementoEvaluacion = claveElementoEvaluacion;
      this.idIndicadorSiac.claveComponente = claveComponente;
      this.claveStorage = claveIndicador;
      this.indicadorStorage = nombre;
      this.descripcionIndicadorStorage = descripcionIndicador;
      this.componenteStorage = `${claveComponente} - ${componente}`;
      this.elementoEvaluacionStorage = `${claveElementoEvaluacion} - ${elementoEvaluacion}`;
      this.estatusStorage = activo? "Activo":"Inactivo"
      
      const areaCentrales: string[] = [];
      const subAreaCentrales: SubAreaCentral[] = [];
  
      subAreaCentralList.forEach(subAreaCentral => {
        if (subAreaCentral.areaCentral && !areaCentrales.includes(subAreaCentral.areaCentral)) {
          areaCentrales.push(subAreaCentral.areaCentral);
        }
        subAreaCentrales.push(subAreaCentral);
      });
  
      this.itemAreaCentralStorage = areaCentrales.join(' | ');
      this.itemSubAreaCentralStorage = subAreaCentrales.map(subArea => subArea.nombre).join(' | ');
      this.idIndicadorSiac.areaCentralList = areaCentrales;
      this.idIndicadorSiac.subAreaCentralList = subAreaCentrales;
      this.idIndicadorSiac.cicloEvaluacionId = cicloEvaluacionId;
    });
  }

  editIndicador()
  {
    this.indicadoresCeRecord
    .open(this.idIndicadorSiac)
    .afterClosed()
    .subscribe(() => {
      this.getResume();
    }
    );
  }

  retornarGeneracionEvaluacion(){
    window.location.assign(this.urlRetorno);
  }



  private setPermissions(): void {
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)

     this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas,permisolHeredado.vistaPadre );
    
    
  
  }

  checkPermission(p: string): boolean {
    return this.permissions?.some(r => r.trim() == p.trim())
  }

}

