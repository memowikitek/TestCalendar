import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Quill from 'quill';
import BlotFormatter, { DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import { QuillModule } from 'ngx-quill';
import { Alert } from 'src/app/utils/helpers';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalUploadPmComponent } from '../modal-upload-pm/modal-upload-pm.component';
import { ModalAutorizePmClmComponent } from '../modal-autorize-pm-clm/modal-autorize-pm-clm.component';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { Router } from '@angular/router';
import saveAs from 'file-saver';
import { IndicatorGoalCaptureDataService } from '../../indicator-goal-capture-data.service';
import { EstatusEtapa6Plandemejora } from 'src/app/utils/models/enums-estatus-etapas';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';
import { Vista } from 'src/app/utils/models';


Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [ResizeAction, DeleteAction];
  }
}


@Component({
  selector: 'app-card-improvement-planexecution-rowinfo',
  templateUrl: './card-improvement-planexecution-rowinfo.component.html',
  styleUrls: ['./card-improvement-planexecution-rowinfo.component.scss']
})
export class CardImprovementPlanexecutionRowinfoComponent {
  @Input() dataRow: any;
  @Input() tipoPantalla: number;
  @Input() fpmArchivoId: number = 0;
  @Input() fpmNombreArchivo: string = '';

  @Output() CargaArchivo = new EventEmitter<any>();
  @Output() AutorizaPmClm = new EventEmitter<any>();
  @Output() EliminaArchivo = new EventEmitter<any>();  
  @Output() activaRetroalimentacion = new EventEmitter<any>();
  @Output() guardarComentarioRetroalimentacion = new EventEmitter<any>();
  // @Output() cancelarComentarioRetroalimentacion = new EventEmitter<any>();
  txtComentario = '';
  estatusEtapa6Plandemejora = EstatusEtapa6Plandemejora
  tipoUsuario = 0 ;
  permissions: string[];

  quillEditorModuleOptions: any;

  /**
   *
   */
  constructor(private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification,
    private router: Router,
    private users: UsersService,
    private indicatorGoalCaptureDataService: IndicatorGoalCaptureDataService,
    private access: Vista,
  ) 
  {
    this.quillEditorModuleOptions = {
      blotFormatter: {
        specs: [CustomImageSpec],
      },
      syntax: false, // Include syntax module
      toolbar: false,
    };


    this.tipoUsuario =  this.users.userSession.tipoRol;
  }

  ngOnInit(): void 
  {
    this.setPermissions();
  }

  cargaArchivo() {
    this.dialog.open<ModalUploadPmComponent>(ModalUploadPmComponent, {
      panelClass: '',
      data: this.dataRow || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      this.CargaArchivo.emit(this.dataRow);
    }
    );
  }

  autorizaPmClm() {
    this.dialog.open<ModalAutorizePmClmComponent>(ModalAutorizePmClmComponent, {
      panelClass: '',
      data: this.dataRow || null,
      width: '70vw',
      minWidth: '70vw',
      maxHeight: '90vh',
    }).afterClosed().subscribe((result: any) => {
      this.AutorizaPmClm.emit(this.dataRow);
    }
    );
  }


  contentChanged(contentChangedEvent: any) {
    // contentChangedEvent.html
    // console.log(contentChangedEvent);
    this.txtComentario = contentChangedEvent.text;
  }

  guardaComentario() {
    this.dataRow.comentarioRetro = this.txtComentario;
    this.guardarComentarioRetroalimentacion.emit(this.dataRow);
  }

  descargaArchivoPmCargado(row: any) {
    if (this.tipoPantalla == 1 && row.idArchivoPmclm) {
      this.EvaCService.GetAzureFileByIdFile(row.idArchivoPmclm, 'ceplanmejoraevidencias').subscribe(res => {
        var fileExt = row.nombreArchivoPmclm.split('.');
        if (fileExt.length > 1) {
          saveAs(res, row.nombreArchivoPmclm);
        }
        // this.CargaArchivo.emit(row.nombreArchivoPmclm);
      });
    }
  }

  eleminarArchivoPmCargado() {
    if (this.tipoPantalla == 1 && this.dataRow.archivoId) {
      Alert.confirm('Eliminar archivo PM/CLM', `¿Deseas eliminar el archivo?`).subscribe((result) => {
        if (!result || !result.isConfirmed) {
          return;
        }
        this.dataRow.areaId = this.dataRow.areaResponsableId // se asigna ya que en la obtencion esta con un nombre y en el guardado tiene otro
        this.EvaCService.addDeleteCeEtapa6PlanMejoraArchivo(this.dataRow).subscribe(response => {
          if (response.exito) {
            let result = response.output as any;
            this.basicNotification.notif("success", `Archivo Eliminado correctamente`);
            this.EliminaArchivo.emit(this.dataRow);
          }
          else {
            this.basicNotification.notif("error", `Archivo no logoó eliminarse`);
          }
        })
      });
    }
  }

  cargaDeEvidencias(tipoOperacion : number)
  {
    // tipoOperacion 1 = verindicadores 2 = toma decision
    console.log('this.dataRow',this.dataRow);
    if(tipoOperacion == 1){
      localStorage.setItem("retroE5", JSON.stringify({
        menu3: 'Etapa 6 Plan de Mejora Ejecución',
        url3: '/indicator-goals-capture/improvementplan-execution-loadreview-evidence?vw=1',
        menu4: this.dataRow.nombreCampus + ' | ' + this.dataRow.nombreArea
      }));
    }

    let datosParaIndicadores = 
    {
      cicloEvaluacionId : this.dataRow.cicloEvaluacionId,
      campusId: this.dataRow.campusId,
      areaResponsableId : this.dataRow.areaResponsableId,
      nombreCampus : this.dataRow.nombreCampus,
      nombreArea : this.dataRow.nombreArea,
      tomaDecisiones : (tipoOperacion == 2 ? false: false)
    }

    this.indicatorGoalCaptureDataService.setCeIndicadoresEtapa6PMDExecutionData(datosParaIndicadores,true);
    this.router.navigateByUrl('/indicator-goals-capture/improvementplan-execution-capture?vw=1');
  }


  revisionDeEvicencia(tipoOperacion : number)
  {
    // tipoOperacion 1 = verindicadores 2 = toma decision
    console.log('this.dataRow',this.dataRow);
    if(tipoOperacion == 1){
      localStorage.setItem("retroE5", JSON.stringify({
        menu3: 'Etapa 6 Plan de Mejora Ejecución',
        url3:'indicator-goals-capture/improvementplan-execution-capture?vw=1',
        menu4: ''//this.dataRow.campus + ' | ' + this.dataRow.areaResponsable
      }));
    }

    let datosParaIndicadores = 
    {
      cicloEvaluacionId : this.dataRow.cicloEvaluacionId,
      campusId: this.dataRow.campusId,
      areaResponsableId : this.dataRow.areaResponsableId,
      nombreCampus : this.dataRow.nombreCampus,
      nombreArea : this.dataRow.nombreArea,
      tomaDecisiones : (tipoOperacion == 2 ? false: false)
    }

    this.indicatorGoalCaptureDataService.setCeIndicadoresEtapa6PMDExecutionData(datosParaIndicadores,true);
    this.router.navigateByUrl('/indicator-goals-capture/improvementplan-execution');
  }

  checkPermission(p: string): boolean {
  
    return this.permissions?.some(r => r.trim() == p.trim())
  }


  private setPermissions(): void {
    var permisolHeredadoList: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    var permisolHeredado = permisolHeredadoList.find(p => p.vistaHijo == this.router.url)
    this.permissions = this.access.getPermissionsV2(this.users.userSession.permisosRolesVistas, permisolHeredado.vistaPadre);
  }




}
