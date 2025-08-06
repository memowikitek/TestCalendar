import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa3Resultados, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

@Component({
  selector: 'app-modal-result-capture',
  templateUrl: './modal-result-capture.component.html',
  styleUrls: ['./modal-result-capture.component.scss']
})
export class ModalResultCaptureComponent {

  // #region variables generales de modal captura

  //titulo del modal
  title = '';
  NombreEtapa = 'resultados'

  errorJustificacionNa = false;
  informacionActual: any;

  // #endregion

  errorJustifficaionIncumplimiento = false;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly modalData: any,
    private readonly users: UsersService,
    private router: Router,
    private readonly refDiag: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    this.informacionActual = JSON.parse(JSON.stringify(modalData))// copia de la informacion actual
    this.configuraVista();
  }

  guardar() {
    this.errorJustifficaionIncumplimiento = false;

    this.modalData.estatusEtapa = EstatusEtapa3Resultados.capturada;
    if (this.modalData._textoSeCumplemeta == 'NO' && !this.modalData.justificacionIncumplimiento) {
      this.errorJustifficaionIncumplimiento = true
      return;
    }

    if (!(this.validaNA())) {
      return;
    }

    this.EvaCService.addUpdateCeEtapa3Resultado(this.modalData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        this.basicNotification.notif("success", `Resultado guardado correctamente` );
        
        if (this.modalData.solicitaNa) {
          this.enviaNotificacionNA(this.modalData);
        }
      }
      else {
        this.basicNotification.notif("error", `Resultado no guardado`);
      }
    })
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
    this.title = (this.modalData.esVista) ? `${ModalTitle.CON} Captura de Resultados por Indicador` : `${ModalTitle.CAP} Resultados por Indicador`;  
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
    this.errorJustifficaionIncumplimiento = false;
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

