import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa5Revisionautoevaluacion } from 'src/app/utils/models/enums-estatus-etapas';

@Component({
  selector: 'app-modal-autorize-na-autoevaluationreview',
  templateUrl: './modal-autorize-na-autoevaluationreview.component.html',
  styleUrls: ['./modal-autorize-na-autoevaluationreview.component.scss']
})
export class ModalAutorizeNaAutoevaluationreviewComponent {
  title = 'Revisión de la autoevaluación';
  seCumpleMetaTexto = '';
  errornocumplimiento = false;
  errorJustificacion = false;
  esVista = false;
  IndicadorSiac: [];
  selectedRubrica: null;
  selectedPuntuaje: null;

  @ViewChild('tablarubrica') tablarubrica: ElementRef;

  selectedValueAutorize: number = null;
  errorAutorizado = false;

  constructor(@Inject(MAT_DIALOG_DATA)
  public readonly resultData: any,
    private users: UsersService,
    private router: Router,
    private readonly ref: MatDialogRef<never>,
    private readonly EvaCService: EvaluationCycleService,
    private basicNotification: BasicNotification) {
    console.log("modal captura result");
    console.log(resultData);

    if (resultData.autorizaNa != null) {
      this.selectedValueAutorize = resultData.autorizaNa == true ? 4 : 5;
    }
    this.seCumpleMetaTexto = this.obtenerTextoSeCumplemetaActual();

    if (!resultData.seConfirmoRubrica && !resultData.seConfirmoRubrica) {
      this.selectedRubrica = null;
    }
    else {
      this.selectedRubrica = resultData.seConfirmoRubrica;
    }

    if (!resultData.seConfirmoPuntaje && !resultData.seAjustoPuntaje) {
      this.selectedPuntuaje = null;
    }
    else {
      this.selectedPuntuaje= resultData.seConfirmoPuntaje;
    }

  }

  onRadioButtonConfirmarRubrica(event: any) {
    this.resultData.seConfirmoRubrica = event.value;
    // si se confirmo la rubrica, por end no seacusto
    this.resultData.seAjustoRubrica = !event.value;
  }

  
  onRadioButtonConfirmarPuntuaje(event: any) {
    this.resultData.seConfirmoPuntaje = event.value;
    // si se confirmo la rubrica, por end no seacusto
    this.resultData.seAjustoPuntaje = !event.value;
  }

  guardar() {

    if (this.selectedValueAutorize == 5) {// No autorizado requiere comentario obligatorio
      this.resultData.autorizaNa = false;
      this.resultData.estatusEtapa =5;
      if (!this.resultData.comentAutorizaNa) {
        this.errorAutorizado = true;
        return;
      }
    }
    else {
      if (this.selectedValueAutorize == 4) { // autorizado no requiere comentarios
        this.resultData.estatusEtapa =4;
        this.resultData.autorizaNa = true
      }
    }

    this.resultData.usuarioId = this.users.userSession.id;
    this.EvaCService.addUpdateCeEtapa5RevisionAutoevaluacion(this.resultData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.ref.close(true);
        let msg = this.resultData.estatusEtapa == 4 ? 'N/A autorizado ' : this.resultData.estatusEtapa == 5 ? 'N/A no autorizado' : 'Revisión de la Autoevaluación';
        this.basicNotification.notif("success", `${msg} correctamente.`);
        }
        else {
          this.basicNotification.notif("error", 'Revisión de la Autoevaluación');
        }
    })
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
      return (this.resultData.cumplimientoActual == true)  ? 'Sí' : 'No';
    }

    if (this.resultData.metaActual == null && this.resultData.resultadoActual != null) {
      return 'Sí';
    }
    return '';
  }

  actualizaRubrica(event: any) {

    let ind = this.resultData.rubrica.findIndex((x: any) => x.rubricaEvaluacionId === event.rubricaEvaluacionId);
    if (ind != -1) {
      this.resultData.rubrica[ind].seleccionado = event.seleccionado;
    }
  }

  configuraNa() {
    this.resultData.puntaje = null;
    this.resultData.comentario = null;
    if (this.resultData.rubrica != null) {
      this.resultData.rubrica.forEach((element: any) => {
        element.seleccionado = false;
      });
    }
  }

  deshabilitaConfirmaValores()
  {
    if (this.resultData.esVista) return true;

    if (this.resultData.seConfirmoPuntaje) return true;
    
    return false;
  }

  onRadioButtonChange(event: any) {
    this.selectedValueAutorize = event.value;
  }



}
