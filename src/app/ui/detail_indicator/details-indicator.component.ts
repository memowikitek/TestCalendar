import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {  AresponsableDTO, DetailsIndicatorDTOV1, DetailsIndicatorNormativaDTOV1, IndicadoresDTOV1, ListaArchivosModuloBienvenida, NormativaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { IndicadorData, IndicatorsRecordService } from '../indicators/modals/indicators-record/indicators-record.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RubricasDTOV1 } from 'src/app/utils/models/rubricas-v1.dto';
import { FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

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
  data: any[];
  filters: TablePaginatorSearch;
  indicadorRecordForm: any;
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
  permissions: string[];
  constructor(
    private readonly indicadoresRecord: IndicatorsRecordService,
    private access : Vista,
    private users: UsersService,
    private router: Router,
  ){ } 

  isDisabled = false;
  ngOnInit(): void {
    this.isDisabled = true;
    this.idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac')); console.log(this.idIndicadorSiac);
    this.IndicadorSiac = this.idIndicadorSiac;
    this.getResume();
    this.setPermissions();
    this.ViewContainerRef.createEmbeddedView(this.templateRef);
  }

  public getResume(): void {
    const {procesoEvaluacionId,claveIndicador,indicador,descripcionIndicador,componente,elementoEvaluacion,areaCentral,subAreaCentral,activo} = this.idIndicadorSiac;//console.log('RESUMEN',this.idIndicadorSiac);
    this.idStorage = procesoEvaluacionId;
    this.claveStorage = claveIndicador;
    this.indicadorStorage = indicador;
    this.idIndicadorStorage = '';//Quitar
    this.descripcionIndicadorStorage = descripcionIndicador;
    this.componenteStorage = this.idIndicadorSiac.claveComponente +' - ' + componente;
    this.elementoEvaluacionStorage = this.idIndicadorSiac.claveElementoEvaluacion +' - ' + elementoEvaluacion;

    if (this.idIndicadorSiac.tipoResultado == 2)
    {
      this.tipoResultado = 'Común'
    }

    if (this.idIndicadorSiac.subAreaCentrales && this.idIndicadorSiac.subAreaCentrales.length >0){
      // this.areaCentralStorage = this.idIndicadorSiac.subAreaCentrales.map((u:any) => u.areaCentral).join(', ');
      this.areaCentralStorage = this.idIndicadorSiac.subAreaCentrales.map((u:any) => u.areaCentral)
      .filter((value:any, index:any, self:any) => self.indexOf(value) === index)
      .join(', ');//Quitar
      this.subAreaCentralStorage = this.idIndicadorSiac.subAreaCentrales.map((u:any) => u.nombre).join(', ');//Quitar  
    }
    //this.activoStorage = activo;
    this.estatusStorage = activo? "Activo":"Inactivo"
  }

  editIndicador()
  {
    this.indicadoresRecord
    .open(this.idIndicadorSiac)
    .afterClosed()
    .subscribe(() => {
      this.getResume();
    }
    );
  }

  retornarIndicadores(){
    window.location.assign("/indicadores");
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

