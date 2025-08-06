import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa3Resultados, EstatusEtapa6Plandemejora, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

@Component({
  selector: 'app-modal-improvementplan-decision-capture',
  templateUrl: './modal-improvementplan-decision-capture.component.html',
  styleUrls: ['./modal-improvementplan-decision-capture.component.scss']
})
export class ModalImprovementplanDecisionCaptureComponent {
// #region variables generales de modal captura

  //titulo del modal
  title = '';
  NombreEtapa = 'Plan de Mejora Diseño'

  errorJustificacionNa = false;
  informacionActual: any;

  // #endregion

  estatusEtapa6Plandemejora = EstatusEtapa6Plandemejora

  esAutorizadorNR = false
  errorJustificacionNr = false

  constructor(@Inject(MAT_DIALOG_DATA) public readonly modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.configuraVista();
  }

  guardaDecisionNOautorizadorNR(){
    this.modalData.estatusEtapa = this.estatusEtapa6Plandemejora.decisionTomada; // predeterminada

    this.modalData.usuarioId = this.users.userSession.id;
    this.errorJustificacionNr = false

    if (this.modalData.decisionArea == 5) // solicitud NR
    {
      if(!this.modalData.justificacionNr)
      {
      this.errorJustificacionNr = true;
      return;
      }
      this.modalData.estatusEtapa = this.estatusEtapa6Plandemejora.noSeRealiza_EnRevisión;
    }

    if (this.modalData.decisionArea != 5 )
    {
      this.modalData.justificacionNr = null
    }

    this.EvaCService.updateCEEtapa6PlanMejoraDecision(this.modalData).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Decisión guardada correctamente` );        
        if (this.modalData.solicitaNa) {
          this.enviaNotificacionNA(this.modalData);
        }
      }
      else {
        this.basicNotification.notif("error", `Decisión no guardada correctamente`);
      }
    })
  }

  guardaDecisionAUTORIZADORNR(){
    this.modalData.usuarioId = this.users.userSession.id;
    
    if (this.modalData.estatusEtapa == this.estatusEtapa6Plandemejora.noSeRealiza_Autorizado){
      this.modalData.autorizaNr = true
    }
    else
    {
      if (this.modalData.estatusEtapa == this.estatusEtapa6Plandemejora.noSeRealiza_No_Autorizado){
        this.modalData.autorizaNr = false
      }
    }

    this.EvaCService.updateCEEtapa6PlanMejoraDecision(this.modalData).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Plan de mejora guardada correctamente` );
        
        if (this.modalData.solicitaNa) {
          this.enviaNotificacionNA(this.modalData);
        }
      }
      else {
        this.basicNotification.notif("error", `Plan de mejora no guardada`);
      }
    })
  }

  guardar() 
  {
   if (!this.esAutorizadorNR)
   {
    this.guardaDecisionNOautorizadorNR();
   }
   else
   {
    this.guardaDecisionAUTORIZADORNR();
   }
  }

  enviaNotificacionNA(dataMsg: any) {
    let datoCicloEvaluacion = this.EvaCService.obtenerDatosDeStorageCicloEvaluacion();
    let arrclaveIndicador =  dataMsg.infoindicador?.claveNombreIndicador.split(' ');
    let claveIndicador = arrclaveIndicador  && arrclaveIndicador.length  > 0 ? arrclaveIndicador[0] : '';
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

  obtenerTextoComplimientoAnterior(data: any) {
    if (data == null) {
      return '';
    }
    return data == true ? 'Sí' : 'No';
  }

  // #region Funciones generales modal captura

  configuraVista() {
    // this.title = (this.modalData.esVista) ? `${ModalTitle.CON} ${this.NombreEtapa}` : `${ModalTitle.CAP} ${this.NombreEtapa}`;
    this.title = (this.modalData.esVista) ? `Consultar ${this.NombreEtapa}` : `${this.NombreEtapa}`;  
    this.validaMetaActual(this.modalData.resultadoActual);
  }

  validaNA(): boolean {
    this.errorJustificacionNa = false;

    // es nulo nunca se aplico para NA
    if (this.modalData.solicitaNa == null) {
      this.modalData.estatusEtapa = EstatusEtapa3Resultados.capturada;
      return true;
    }

    // si tenia seleccionado y des selecciono
    if (!this.modalData.solicitaNa && this.informacionActual.solicitaNa) {
      if (this.modalData.resultadoActual) { // si tiene datos es capturada
        this.modalData.estatusEtapa = EstatusEtapa3Resultados.capturada;
        this.modalData.justificacionNa = null;
      }
      else {// si NO tiene datos es pendiente
        this.modalData.estatusEtapa = EstatusEtapa3Resultados.pendiente;
        this.modalData.justificacionNa = null;
      }

      return true;
    }

    // si selecciono solicita NA entonces configura los datos de captura en null y continua
    if (this.modalData.solicitaNa == true && this.modalData.justificacionNa) {
      this.configuraNa();
      this.modalData.estatusEtapa = EstatusEtapa3Resultados.naenrevisión;
      return true;
    }

    if (this.modalData.solicitaNa == false) {
      this.modalData.estatusEtapa = EstatusEtapa3Resultados.capturada;
      return true;
    }

    //Retorna error
    this.errorJustificacionNa = true;
    return false
  }

  configuraNa() {
    this.modalData.resultadoActual = null;
    this.modalData.cumplimientoActual = null
    this.modalData._textoSeCumplemeta = '';
    this.modalData.justificacionIncumplimiento = null;
  }
  // #endregion


  validaMetaActual(event: any) {
    this.modalData._textoSeCumplemeta = '' // se agrega esta propiedad para ligar el text de cumple SI o NO, no se envia a la api  
    if ((this.modalData.metaActual == null && event == null) || (this.modalData.metaActual != null && event == null)) {
      this.modalData._textoSeCumplemeta = ''
      this.modalData.cumplimientoActual = null;
      return;
    }

    if (this.modalData.metaActual > event) // no cumple la meta 
    {
      this.modalData._textoSeCumplemeta = 'No'
      this.modalData.cumplimientoActual = false;
    }
    else {
      this.modalData._textoSeCumplemeta = 'Sí'
      this.modalData.cumplimientoActual = true;
      this.modalData.justificacionIncumplimiento = null;
    }
  }

}
