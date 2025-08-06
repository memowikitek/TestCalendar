import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { NotificacionesNaDto } from 'src/app/utils/models/notificaciones-na.dto';

@Component({
  selector: 'app-modal-autoevaluationreview-ajust-capture',
  templateUrl: './modal-autoevaluationreview-ajust-capture.component.html',
  styleUrls: ['./modal-autoevaluationreview-ajust-capture.component.scss']
})
export class ModalAutoevaluationreviewAjustCaptureComponent {
  title: string;
  seCumpleMetaTexto = '';
  errornocumplimiento = false;
  errorJustificacion = false;
  esVista = false;
  IndicadorSiac: [];
  selectedRubrica: null;
  selectedPuntuaje: true;
  errorObservacionAjuste = false;

  @ViewChild('tablarubrica') tablarubrica: ElementRef;
  columns = ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'];



  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly resultData: any,
    private users: UsersService,
    private router: Router,
    private readonly ref: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {

    this.title = (this.resultData.esVista)?'Consultar Revisión de la Autoevaluación':'Revisión de la Autoevaluación';
    this.seCumpleMetaTexto = this.obtenerTextoSeCumplemetaActual();
    
    if (!this.resultData.esVista) // valida y asigna un valos predeterminado
    {
      this.resultData.seConfirmoRubrica = resultData.seAjustoRubrica == resultData.seConfirmoRubrica ? true : resultData.seConfirmoRubrica
    }
    else // si no tiene valor en vista debe mostrarse tal como esta sin guardar 
    {
      this.resultData.seConfirmoRubrica = resultData.seAjustoRubrica == resultData.seConfirmoRubrica ? null : resultData.seConfirmoRubrica
    }
     
    if(!(this.resultData.seConfirmoRubrica == null))
    {
      if (resultData.seConfirmoRubrica) {
        this.columns = ['escala', 'seleccionado', 'requisitoCondicion'];
      }
      else 
      {
        this.columns = ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'];
      }
    }
    else
    {
      this.columns = ['escala', 'seleccionado', 'requisitoCondicion'];
    }
    
    if (!this.resultData.esVista) // valida y asigna un valos predeterminado
    {
      this.resultData.seConfirmoPuntaje = resultData.seConfirmoPuntaje ==  resultData.seAjustoPuntaje ? true : resultData.seConfirmoPuntaje;
    }
    else // si no tiene valor en vista debe mostrarse tal como esta sin guardar 
    {
      this.resultData.seConfirmoPuntaje = resultData.seConfirmoPuntaje ==  resultData.seAjustoPuntaje ? null : resultData.seConfirmoPuntaje;
    }
     
    if (!resultData.autoevaluacionEstatusfinal)  
    { 
      // define si se realizo alguna captura en la etapa 4 si esta en false, no se ha realizado captura
      // en este caso predeterminado forza al ajuste
      resultData.seConfirmoRubrica = false ; 
      resultData.seAjustoPuntaje = true;
      resultData.seConfirmoPuntaje = false ;
      resultData.seAjustoRubrica = true;
      this.columns = ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'];
    }
    
  }

  onRadioButtonConfirmarRubrica(event: any) {

    this.resultData.seConfirmoRubrica = event.value;
    // si se confirmo la rubrica, por end no seacusto
    this.resultData.seAjustoRubrica = !event.value;

    if (this.resultData.seConfirmoRubrica) {
      this.columns = ['escala', 'seleccionado', 'requisitoCondicion'];
    }
    else 
    {
      this.columns = ['escala', 'seleccionado', 'seleccionajustada', 'requisitoCondicion'];
    }
  }


  onRadioButtonConfirmarPuntuaje(event: any) {
    this.resultData.seConfirmoPuntaje = event.value;
    // si se confirmo la rubrica, por end no seacusto
    this.resultData.seAjustoPuntaje = !event.value;
  }

  guardar() {
    this.errorObservacionAjuste = false;

    this.resultData.usuarioId = this.users.userSession.id;
    this.resultData.estatusEtapa = 2

    if(this.resultData.seAjustoRubrica == null)
    {
      this.resultData.seAjustoRubrica = false
      this.resultData.seConfirmoRubrica = false
    }
    else
    {
      this.resultData.seConfirmoRubrica = !this.resultData.seAjustoRubrica 
    }

    if(this.resultData.seConfirmoPuntaje || this.selectedPuntuaje)
    {
      this.resultData.puntajeAjustado = this.resultData.puntaje;
      this.resultData.observacionAjuste = null
    }

    if (this.resultData.seAjustoPuntaje == true && this.resultData.seConfirmoPuntaje == false && !(this.resultData.observacionAjuste))
    {
      this.errorObservacionAjuste = true
      return;
    }

    if (this.resultData.solicitaNa != null && this.resultData.solicitaNa == true && !this.resultData.justificacionNa) {
      this.errorJustificacion = true;
      return;
    }

    if (this.resultData.solicitaNa != null && this.resultData.solicitaNa == true) {
      this.configuraNa();
      this.resultData.estatusEtapa = 3; // en revision
    }
    
    this.EvaCService.addUpdateCeEtapa5RevisionAutoevaluacion(this.resultData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.ref.close(true);
        this.basicNotification.notif("success", `Revisión de la autoevaluación guardada correctamente.` );        
        if (this.resultData.solicitaNa) {
          this.enviaNotificacionNA(this.resultData);
        }
      }
      else {
        this.basicNotification.notif("error", `Revisión de la autoevaluación no fue guardada correctamente.`);
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
    this.ref.close(true);
  }

  limitarCaracteres(event: any) {
    const valor = event.target.value;
    if (valor) {
      event.target.value = valor.replace('.', '');
    }
    if (valor.length > 6) {
      event.target.value = valor.slice(0, 6);
    }

    if (!event.target.value) {
      this.seCumpleMetaTexto = '';
    }

    if (this.resultData.metaActual && event.target.value > 0) {
      this.seCumpleMetaTexto = event.target.value >= this.resultData.metaActual ? 'Sí' : 'No';
      this.resultData.cumplimientoActual = this.seCumpleMetaTexto == 'Sí' ? true : false
      if (this.seCumpleMetaTexto == 'Sí') {
        this.resultData.JustificacionIncumplimiento = null;
      }
    }
    else {
      if (!this.resultData.metaActual && event.target.value > 0) {
        this.seCumpleMetaTexto = 'Sí';
        this.resultData.cumplimientoActual = true;
        this.resultData.JustificacionIncumplimiento = null;
      }
    }
  }

  obtenerTextoComplimientoAnterior(data: any) {

    if (data == null) {
      return '';
    }
    return data == true ? 'Sí' : 'No';
  }

  aplicarReglasNegocioSolicita(cheked: any, event: any) {
    if (cheked == false) {
      this.resultData.justificacionNA = null
    }
  }


  obtenerTextoSeCumplemetaActual() {
    if (this.resultData.cumplimientoActual != null) { // ya existe un valor 
      return (this.resultData.cumplimientoActual == true) ? 'Sí' : 'No';
    }

    if (this.resultData.metaActual == null && this.resultData.resultadoActual != null) {
      return 'Sí';
    }
    return '';
  }

  actualizaRubrica(event: any) {

    let ind = this.resultData.rubrica.findIndex((x: any) => x.ceetapa5RevisionAutoevaluacionRubricaId === event.ceetapa5RevisionAutoevaluacionRubricaId
    && x.requisitoCondicion === event.requisitoCondicion);
    if (ind != -1) {
      this.resultData.rubrica[ind].seleccionado = event.seleccionado;
    }
  }

  actualizaAjusteRubrica(event: any) {
    let ind = this.resultData.rubrica.findIndex((x: any) => x.ceetapa5RevisionAutoevaluacionRubricaId === event.ceetapa5RevisionAutoevaluacionRubricaId
  && x.requisitoCondicion === event.requisitoCondicion);
    if (ind != -1) {
      this.resultData.rubrica[ind].seleccionAjustada = event.seleccionAjustada;
    }
  }

  configuraNa() {
    this.resultData.observacionAjuste = null
    this.resultData.seConfirmoRubrica=null
    this.resultData.seAjustoRubrica=null
    this.resultData.seAjustoPuntaje = null
    this.resultData.seConfirmoPuntaje = null 
    this.resultData.puntajeAjustado = null
    this.resultData.puntaje = null;
    this.resultData.comentario = null;
    if (this.resultData.rubrica != null) {
      this.resultData.rubrica.forEach((element: any) => {
        element.seleccionado = false;
      });
    }
  }

  deshabilitaConfirmaValores() {
    if (this.resultData.esVista || this.resultData.solicitaNa) return true;
    
    // if (this.resultData.seConfirmoPuntaje == null) return true;
    // if (this.resultData.seConfirmoPuntaje) return true;
    return false;
  }

  visualizapuntuajeActual() {

    return true

  }

}
