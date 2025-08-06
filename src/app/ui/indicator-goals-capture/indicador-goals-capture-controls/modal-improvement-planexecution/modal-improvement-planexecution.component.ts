import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import saveAs from 'file-saver';
import { pipe } from 'rxjs';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { Alert } from 'src/app/utils/helpers';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { CEEtapa6PMEArchivoCreateModel, CeEtapa6PmeArchivoNivModCreateModel, CEEtapa6PMECreateModel } from 'src/app/utils/models/ce-etapa6-pmearchivo-create.dto';
import { EstatusEtapa3Resultados, EstatusEtapa6Plandemejora, EstatusEtapa7, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto'
import { pipeline } from 'stream';


@Component({
  selector: 'app-modal-improvement-planexecution',
  templateUrl: './modal-improvement-planexecution.component.html',
  styleUrls: ['./modal-improvement-planexecution.component.scss']
})
export class ModalImprovementPlanexecutionComponent {
  // #region variables generales de modal captura

  //titulo del modal
  title = 'evidencia del PM/CLM';
  NombreEtapa = ''

  errorevidencia = false;
  informacionActual: any;
  // #endregion

  estatusEtapa7 = EstatusEtapa7

  esAutorizadorNR = false
  dataSourceArchivos: MatTableDataSource<any>;
  ceetapa6PlanMejoraEjecucionId: CEEtapa6PMECreateModel;
  comentarioEvidencia = ''

  constructor(@Inject(MAT_DIALOG_DATA) public readonly modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {

    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.ceetapa6PlanMejoraEjecucionId = new CEEtapa6PMECreateModel();
    if (!this.ceetapa6PlanMejoraEjecucionId.archivos) {
      this.ceetapa6PlanMejoraEjecucionId.archivos = [];
    }
    this.ceetapa6PlanMejoraEjecucionId.estatusEtapa = 1
    // this.ceetapa6PlanMejoraEjecucionId.evidenciaDescripcion = 'Prueba'
    this.ceetapa6PlanMejoraEjecucionId.usuarioId = this.users.userSession.id;
    this.configuraVista();
  }

  handleUpload(event: any) {

    // archivo
    const file = event.target.files[0];
    if (file.size > 40000000) {
      this.basicNotification.notif("error", 'No se puede agregar el archivo ya que es mayor a 40MB');
      return;
    }
    ///
    // extension
    /////
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      let cEEtapa6PMEArchivoCreateModel = new CEEtapa6PMEArchivoCreateModel();
      cEEtapa6PMEArchivoCreateModel.base64 = reader.result;
      cEEtapa6PMEArchivoCreateModel.nivelesModalidad = [];

      let ceEtapa6PmeArchivoNivModCreateModel = new CeEtapa6PmeArchivoNivModCreateModel();
      ceEtapa6PmeArchivoNivModCreateModel.ceetapa6PlanMejoraEjecucionId = this.modalData.ceetapa6PlanMejoraEjecucionId;
      ceEtapa6PmeArchivoNivModCreateModel.ceevaluacionId = this.modalData.ceevaluacionId;

      var extension = file.name.split('.').pop();
      // var name = file.name.split('.')[0];
      var name = this.getnombreevidencia();
      // para asignar nomenclatura
      ceEtapa6PmeArchivoNivModCreateModel.nombreArchivo = name + '.' + extension;
      cEEtapa6PMEArchivoCreateModel.nivelesModalidad.push(ceEtapa6PmeArchivoNivModCreateModel);
      this.ceetapa6PlanMejoraEjecucionId.archivos.push(cEEtapa6PMEArchivoCreateModel);
      this.modalData.archivos.push(this.ceetapa6PlanMejoraEjecucionId);

      if (this.modalData.esCarga && this.ceetapa6PlanMejoraEjecucionId.archivos.length > 0) {
        this.dataSourceArchivos = new MatTableDataSource<any>;
        this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
      }

    };
  }

  guardaarchivo() {
    this.errorevidencia = false;

    this.ceetapa6PlanMejoraEjecucionId.usuarioId = this.users.userSession.id;
    this.ceetapa6PlanMejoraEjecucionId.estatusEtapa = this.estatusEtapa7.guardada;
    this.ceetapa6PlanMejoraEjecucionId.evidenciaDescripcion = this.modalData.evidenciaDescripcion;
    if (!this.modalData.evidenciaDescripcion) {
      this.errorevidencia = true;
      return;
    }

    this.EvaCService.addCeEtapa6PlanMejoraEvidencia(this.ceetapa6PlanMejoraEjecucionId).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Evidencia guardada correctamente`);
      }
      else {
        this.basicNotification.notif("error", `Evidencia no guardada`);
      }
    })
  }

  guardar() {
    this.guardaarchivo();
  }

  closeModal() {
    this.refDiag.close(true);
  }

  // #region Funciones generales modal captura

  configuraVista() {

    if (this.modalData.esCarga) {
      this.modalData.archivos = [];
      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
    }
    else {
      this.dataSourceArchivos = new MatTableDataSource<any>;
      this.dataSourceArchivos.data = this.modalData.archivos
    }
    console.log(this.modalData)
    this.title = this.modalData.esCarga ? 'Cargar ' + this.title : this.modalData.edit ? 'Editar ' + this.title : 'Consultar ' + this.title
  }

  // #endregion

  DownloadFile(file: any) {
    var fileExt = file.archivoNombre.split('.');
    if (fileExt.length > 1) {
      this.EvaCService.getAzureFilePM(file.archivoId).subscribe((res: any) => {
        saveAs(res, file.archivoNombre);
      });
    }
  }

  remove(index: any, row: any): void {
    Alert.confirm('Eliminar evidencia', '¿Deseas eliminar la evidencia?').subscribe((result) => {
      if (!result || !result.isConfirmed) {
          return;
      }
      if (this.modalData.esCarga && this.ceetapa6PlanMejoraEjecucionId.archivos.length > 0) {
        this.ceetapa6PlanMejoraEjecucionId.archivos.splice(index, 1)
        this.dataSourceArchivos = new MatTableDataSource<any>;
        this.dataSourceArchivos.data = this.ceetapa6PlanMejoraEjecucionId.archivos
      }
    });
  }

  Convert(string: any) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getnombreevidencia() {

    let ciclodatos = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let proceso = ciclodatos.procesoEvaluacion; //this.evidenciaData.infoindicador.CicloEvaluacionInfo.procesoEvaluacion;
    let claveInstitucion = ciclodatos.claveInstitucion;
    let anio = ciclodatos.anio;
    let ciclo = ciclodatos.ciclo;
    let clavecampus = this.modalData.claveCampus;
    let areaResponsableSiglas = this.modalData.claveAreaResponsable; //No lo de vuelve el all claveAreaResponsable;
    let claveComponente = this.modalData.claveComponente // no lo devuelve el componente el all claveComponente;
    let claveIndicador = this.modalData.claveIndicador;
    let nivelModalidad = this.modalData.nivelModalidadDescripcion.toUpperCase() == 'CAMPUS' ? 'COMUN' : this.modalData.nivelModalidadDescripcion;
    let claveEdivencia = '' //this.modalData.claveEvidencia;

    let nombre = `${proceso}_${claveInstitucion}_${anio}_${ciclo}_${clavecampus}_${areaResponsableSiglas}_${claveComponente}_${claveIndicador}_${nivelModalidad}${claveEdivencia}`
    let numeroConsecutivo = 1;
    if (this.modalData.esCarga) {
      let cantidadActual = this.informacionActual.archivos ? this.informacionActual.archivos.length : 0;
      let enArray = this.ceetapa6PlanMejoraEjecucionId.archivos ? this.ceetapa6PlanMejoraEjecucionId.archivos.length : 0;
      numeroConsecutivo = enArray + cantidadActual + 1
    }
    nombre = this.Convert(nombre);
    //// concatenacion
    let nombreMayuscula = 'PM_' + nombre.toUpperCase() + '_' + numeroConsecutivo.toString();
    return nombreMayuscula;
  }

  removeAzure(row: any, index: any): void {

    if (!row.ceetapa6PlanMejoraEjecucionArchivoId) {
      return;
    }
    Alert.confirm('Eliminar evidencia', '¿Deseas eliminar la evidencia?').subscribe((result) => {
      
      if (!result || !result.isConfirmed) {
        return;
      }

      this.EvaCService.deleteCeEtapa6PMEEvidenciaArchivo(row.ceetapa6PlanMejoraEjecucionArchivoId).subscribe(response => {
        if (response.output) {
          this.basicNotification.notif("success", `Evidencia eliminada correctamente`);
          if (!this.modalData.esCarga) {
            this.modalData.archivos.splice(index, 1);
            this.dataSourceArchivos = new MatTableDataSource<any>;
            this.dataSourceArchivos.data = this.modalData.archivos
            if (this.modalData.archivos.length == 0 ){
              this.refDiag.close(true);
            }
          }
        }
        else {
          this.basicNotification.notif("error", `Evidencia no eliminada`);
        }
      })

    });

  }

}
