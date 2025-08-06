import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa4Autoevaluacion, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

@Component({
  selector: 'app-modal-autoevaluation-capture',
  templateUrl: './modal-autoevaluation-capture.component.html',
  styleUrls: ['./modal-autoevaluation-capture.component.scss']
})
export class ModalAutoevaluationCaptureComponent {

  @ViewChild('tablarubrica') tablarubrica: ElementRef;

  // #region variables generales de modal captura

  //titulo del modal
  title = '';
  NombreEtapa = 'Autoevaluación'

  errorJustificacionNa = false;
  informacionActual: any;

  // #endregion

  errorPuntuaje = false;
  errorRequisito= false;

  constructor(@Inject(MAT_DIALOG_DATA) public modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.configuraVista();
  }

  guardar() {

    this.modalData.usuarioId = this.users.userSession.id;
    this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.capturada; // predeterminada al guardar

    if (!this.validaReglasDenegocio()) {
      return;
    }

    if (!(this.validaNA())) {
      return;
    }

    this.EvaCService.addUpdateCeEtapa4Autoevaluacion(this.modalData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Autoevaluación guardada correctamente`);
        if (this.modalData.solicitaNa) {
          this.enviaNotificacionNA(this.modalData);
        }
      }
      else {
        this.basicNotification.notif("error", `Autoevaluación no guardada`);
      }
    });

  }

  enviaNotificacionNA(dataMsg: any) {
    let datoCicloEvaluacion = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let arrclaveIndicador = dataMsg.infoindicador?.claveNombreIndicador.split(' ');
    let claveIndicador = arrclaveIndicador && arrclaveIndicador.length > 0 ? arrclaveIndicador[0] : '';
    let msg = new NotificacionesNaDto();
    msg.cicloEvaluacionId = dataMsg.cicloEvaluacionId;
    msg.titulo = `Autorización NA: ${datoCicloEvaluacion.etapaEvaluacion[0].etapa}`;
    msg.mensaje = `${datoCicloEvaluacion.cicloEvaluacion} ${dataMsg.infoindicador.campus} ${dataMsg.infoindicador.areaResponsable} ${claveIndicador}`
    msg.usuarioCreacion = this.users.userSession.id;
    this.EvaCService.sendNotificacionNA(msg).subscribe((respmsg: any) => {
      if (respmsg.Exito) {
        console.info("el mensaje fue enviado correctamente", msg);
      }
    });
  }

  closeModal() {
    this.refDiag.close(true);
  }


  actualizaRubrica(event: any) {

    let ind = this.modalData.rubrica.findIndex((x: any) => x.rubricaEvaluacionId === event.rubricaEvaluacionId);
    if (ind != -1) {
      this.modalData.rubrica[ind].seleccionado = event.seleccionado;
    }
  }


  // #region Funciones generales modal captura

  validaReglasDenegocio(): boolean {
    this.errorPuntuaje = false;
    this.errorRequisito =false;
    
    let ind = this.modalData.rubrica.findIndex((x: any) => x.seleccionado === true);
    let haySeleccionados = ind != -1 // verifica si hay alguna rubrica seleccionada
    if (!this.modalData.solicitaNa && (this.modalData.puntaje == null || !haySeleccionados)) {
      
      if(this.modalData.puntaje == null){
        this.errorPuntuaje = true
      }
      if(!haySeleccionados){
        this.errorRequisito =true;
      }
      return false
    }


    // es valida la informacion
    return true;
  }

  configuraVista() {
    this.title = (this.modalData.esVista) ? `${ModalTitle.CON} ${this.NombreEtapa}` : `${ModalTitle.CAP} ${this.NombreEtapa}`;
  }

  validaNA(): boolean {
    this.errorJustificacionNa = false;

    // es nulo nunca se aplico para NA
    if (this.modalData.solicitaNa == null) {
      this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.capturada;
      return true;
    }

    // si tenia seleccionado y des selecciono
    if (!this.modalData.solicitaNa && this.informacionActual.solicitaNa) {
      let ind = this.modalData.rubrica.findIndex((x: any) => x.seleccionado === true);
      let haySeleccionados = ind != -1 // verifica si hay alguna rubrica seleccionada
      if (haySeleccionados || this.modalData.puntaje != null) { // si tiene datos es capturada
        this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.capturada;
        this.modalData.justificacionNa = null;
      }
      else {// si NO tiene datos es pendiente
        this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.pendiente;
        this.modalData.justificacionNa = null;
      }

      return true;
    }

    // si selecciono solicita NA entonces configura los datos de captura en null y continua
    if (this.modalData.solicitaNa == true && this.modalData.justificacionNa) {
      this.configuraNa();
      this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.naenrevisión;
      return true;
    }

    if (this.modalData.solicitaNa == false) {
      this.modalData.estatusEtapa = EstatusEtapa4Autoevaluacion.capturada;
      return true;
    }

    //Retorna error
    this.errorJustificacionNa = true;
    return false
  }

  configuraNa() {
    // todo se configura en null
    this.modalData.puntaje = null;
    this.modalData.comentario = null;
    if (this.modalData.rubrica != null) {
      this.modalData.rubrica.forEach((element: any) => {
        element.seleccionado = false;
      });
    }
  }

  // #endregion
}
