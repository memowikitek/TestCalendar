import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvaluationCycleService, UsersService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/shared/validators';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { EstatusEtapa3Resultados, ModalTitle } from 'src/app/utils/models/enums-estatus-etapas';



@Component({
  selector: 'app-modal-autorize-na-result',
  templateUrl: './modal-autorize-na-result.component.html',
  styleUrls: ['./modal-autorize-na-result.component.scss']
})
export class ModalAutorizeNaResultComponent {
  // #region variables generales de modal NA

  //titulo del modal
  title = '';
  NombreEtapa = 'resultados'

  errorAutorizado = false;
  informacionActual: any;

  // #endregion

  estatusEtapa3Resultados = EstatusEtapa3Resultados

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

    if (!(this.validaAutorizacion())){
      return;
    }
    this.EvaCService.addUpdateCeEtapa3Resultado(this.modalData, this.users.userSession.id).subscribe(response => {
      if (response.output) {
        let result = response.output as any;
        this.refDiag.close(true);
        let msgNa = this.modalData.estatusEtapa ==  EstatusEtapa3Resultados.naNOautorizado  ? `N/A no autorizado` : this.modalData.estatusEtapa ==  EstatusEtapa3Resultados.naautorizado ? `N/A autorizado` : `Resultado guardado`;
        this.basicNotification.notif("success", `${msgNa} correctamente` );
      }
      else {
        this.basicNotification.notif("error", `Resultado no guardado`);
      }
    })

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


  // #region Funciones generales de modal NA

  configuraVista() {
    this.title = `${ModalTitle.AUTNA} ${this.NombreEtapa}`;  
    this.validaMetaActual(this.modalData.resultadoActual);
  }

  validaAutorizacion(): boolean
  {
    this.errorAutorizado = false;
    if (this.modalData.estatusEtapa == EstatusEtapa3Resultados.naNOautorizado && !this.modalData.comentAutorizaNa){
      this.errorAutorizado = true
      return false
    }

    if (this.modalData.estatusEtapa == EstatusEtapa3Resultados.naautorizado){
      this.modalData.comentAutorizaNa =null;
    }

    this.modalData.autorizaNa = (this.modalData.estatusEtapa == EstatusEtapa3Resultados.naautorizado)
    return true;
  }

  // #endregion

  validaMetaActual(event: any) {
    this.modalData._textoSeCumplemeta = '' // se agrega esta propiedad para ligar el text de cumple SI o NO, no se envia a la api
    if ((this.modalData.metaActual == null && event == null) || (this.modalData.metaActual != null && event == null)) {
      this.modalData._textoSeCumplemeta = ''
      return;
    }

    if (this.modalData.metaActual > event) // no cumple la meta 
    {
      this.modalData._textoSeCumplemeta = 'No'
    }
    else {
      this.modalData._textoSeCumplemeta = 'Sí'
    }
  }


}
