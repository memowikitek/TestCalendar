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
import { Vista } from 'src/app/utils/models';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';


Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [ResizeAction, DeleteAction];
  }
}

@Component({
  selector: 'app-card-improvement-plandesign-rowinfo',
  templateUrl: './card-improvement-plandesign-rowinfo.component.html',
  styleUrls: ['./card-improvement-plandesign-rowinfo.component.scss']
})
export class CardImprovementPlandesignRowinfoComponent {
  @Input() dataRow: any;
  @Input() tipoPantalla: number;
  @Output() CargaArchivo = new EventEmitter<any>();
  @Output() AutorizaPmClm = new EventEmitter<any>();
  @Output() EliminaArchivo = new EventEmitter<any>();
  
  @Output() activaRetroalimentacion = new EventEmitter<any>();
  @Output() guardarComentarioRetroalimentacion = new EventEmitter<any>();
  // @Output() cancelarComentarioRetroalimentacion = new EventEmitter<any>();
  quillEditorModuleOptions: any;
  txtComentario = '';
  estatusEtapa6Plandemejora = EstatusEtapa6Plandemejora
  permissions: string[];

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
  ) {
      this.quillEditorModuleOptions = {
      blotFormatter: {
        specs: [CustomImageSpec],
      },
      syntax: false, // Include syntax module
      toolbar: false,
    };

    this.setPermissions();
  }
  ngOnInit(): void {
    
  }

  checkActivaRetroalimentacion(event: any) {

    let text = 'El objetivo de esta sesión de retroalimentación es revisar con el responsable de área el puntaje y el cumplimiento de acciones de acuerdo a la rúbrica, para confirmar o realizar los ajustes necesarios. '
      + '<br /> <br /> Una vez seleccionada esta opción, no podrá desmarcarse. Confirma que sí te encuentras en la sesión con el responsaable de área.';
    Alert.confirmSession('Confirmación', text).subscribe((result) => {
      if (!result || !result.isConfirmed) {
        setTimeout(() => {
          this.dataRow.sesionRetro = null;
        }, 500);

        this.ref.detectChanges();

        setTimeout(() => {
          this.dataRow.sesionRetro = false;
          this.ref.detectChanges();
        }, 1000);

      }
      else {
        this.dataRow.comentarioRetro = this.txtComentario;;
        this.dataRow.sesionRetro = true;
        event.dataRow = this.dataRow;
        this.activaRetroalimentacion.emit(this.dataRow);
      }
    });
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

  descargaArchivoPm() {
    if (this.tipoPantalla == 2) {
      this.EvaCService.GetAzureFileByIdFile(this.dataRow.idArchivoPmclm, 'ceplanmejoraevidencias').subscribe(res => {
        var fileExt = this.dataRow.nombreArchivoPmclm.split('.');
        if (fileExt.length > 1) {
          saveAs(res, this.dataRow.nombreArchivoPmclm);
        }
        this.CargaArchivo.emit(this.dataRow);
      });
    }
  }

  descargaArchivoPmCargado() {
    if (this.tipoPantalla == 1 && this.dataRow.archivoId) {
      this.EvaCService.GetAzureFileByIdFile(this.dataRow.archivoId, 'ceplanmejoraevidencias').subscribe(res => {
        var fileExt = this.dataRow.nombreArchivoPmclm.split('.');
        if (fileExt.length > 1) {
          saveAs(res, this.dataRow.nombreArchivoPmclm);
        }
        this.CargaArchivo.emit(this.dataRow);
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
            this.basicNotification.notif("success", `Archivo PM/CLM eliminado correctamente`);
            this.EliminaArchivo.emit(this.dataRow);
          }
          else {
            this.basicNotification.notif("error", `Archivo PM/CLM NO eliminado correctamente`);
          }
        })
      });
    }
  }

  verIndicadoresYTomadecision(tipoOperacion : number) {
    //if(tipoOperacion == 1){
      localStorage.setItem("retroE5", JSON.stringify({
        menu3: 'Etapa 6 Plan de Mejora Diseño - Captura',
        url3:'indicator-goals-capture/improvement-plandesign-capture-autorization?vw=1',
        menu4: this.dataRow.nombreCampus + ' | ' + this.dataRow.nombreArea
      }));
    //}
    
    if (this.dataRow.esAreaConsolidada){
      Alert.confirmAreaConsolidada('Área consolidada','Tu dependencia de área cargará el plan de mejora y la toma de decisiones. Puedes conocer tus indicadores y consultar tus datos.')
      .subscribe(resp =>
      {

      let datosParaIndicadores = 
      {
        cicloEvaluacionId : this.dataRow.cicloEvaluacionId,
        campusId: this.dataRow.campusId,
        areaResponsableId : this.dataRow.areaResponsableId,
        nombreCampus : this.dataRow.nombreCampus,
        nombreArea : this.dataRow.nombreArea,
        tomaDecisiones : (tipoOperacion == 2 && !this.dataRow.esAreaConsolidada ? true : false),
        esAreaConsolidada : this.dataRow.esAreaConsolidada
      }
      
      this.indicatorGoalCaptureDataService.setCeIndicadoresEtapa6PMDData(datosParaIndicadores,true);
      this.router.navigateByUrl('/indicator-goals-capture/improvementplan-autoriza');
      });

    }
    else
    {
      let datosParaIndicadores = 
      {
        cicloEvaluacionId : this.dataRow.cicloEvaluacionId,
        campusId: this.dataRow.campusId,
        areaResponsableId : this.dataRow.areaResponsableId,
        nombreCampus : this.dataRow.nombreCampus,
        nombreArea : this.dataRow.nombreArea,
        tomaDecisiones : (tipoOperacion == 2 && !this.dataRow.esAreaConsolidada ? true : false),
        esAreaConsolidada : this.dataRow.esAreaConsolidada
      }
      this.indicatorGoalCaptureDataService.setCeIndicadoresEtapa6PMDData(datosParaIndicadores,true);
      this.router.navigateByUrl('/indicator-goals-capture/improvementplan-autoriza');
    }
    
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
