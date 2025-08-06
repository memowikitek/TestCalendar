import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa4Autoevaluacion, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';

@Component({
  selector: 'app-modal-autorize-na-autoevaluation',
  templateUrl: './modal-autorize-na-autoevaluation.component.html',
  styleUrls: ['./modal-autorize-na-autoevaluation.component.scss']
})
export class ModalAutorizeNaAutoevaluationComponent {
    // #region variables generales de modal NA

  //titulo del modal
  title = '';
  NombreEtapa = 'autoevaluación'

  errorAutorizado = false;
  informacionActual: any;

  // #endregion

  estatusEtapa4Autoevaluacion= EstatusEtapa4Autoevaluacion;

  @ViewChild('tablarubrica') tablarubrica: ElementRef;

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

    if(!this.validaAutorizacion()){
      return;
    }
    this.modalData.usuarioId = this.users.userSession.id;
    this.EvaCService.addUpdateCeEtapa4Autoevaluacion(this.modalData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
      let result = response.output as any;
      this.refDiag.close(true);
      let msg = this.modalData.estatusEtapa == EstatusEtapa4Autoevaluacion.naautorizado ? 'N/A autorizado ' : this.modalData.estatusEtapa == EstatusEtapa4Autoevaluacion.naNOautorizado ? 'N/A no autorizado' : 'Autoevaluación guardada';
      this.basicNotification.notif("success", `${msg} correctamente.`);
      }
      else {
        this.basicNotification.notif("error", 'Autoevaluación no guardada');
      }
    })

  }

  closeModal() {
    this.refDiag.close(true);
  }


  actualizaRubrica(event : any){
    let ind = this.modalData.rubrica.findIndex((x: any) => x.rubricaEvaluacionId === event.rubricaEvaluacionId);
    if (ind != -1) {
      this.modalData.rubrica[ind].seleccionado = event.seleccionado;
    }
  }

  // #region Funciones generales de modal NA

  configuraVista() {
    this.title = `${ModalTitle.AUTNA} ${this.NombreEtapa}`;  

  }

  validaAutorizacion(): boolean
  {
    this.errorAutorizado = false;
    if (this.modalData.estatusEtapa == EstatusEtapa4Autoevaluacion.naNOautorizado && !this.modalData.comentAutorizaNa){
      this.errorAutorizado = true
      return false
    }

    if (this.modalData.estatusEtapa == EstatusEtapa4Autoevaluacion.naautorizado){
      
      this.modalData.comentAutorizaNa =null;
    }

    this.modalData.autorizaNa = (this.modalData.estatusEtapa == EstatusEtapa4Autoevaluacion.naautorizado)
    return true;
  }

  // #endregion




}
